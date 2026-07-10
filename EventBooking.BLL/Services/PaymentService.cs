using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;
using StripeEvent = Stripe.Event;          // disambiguate from DAL.Entities.Event

namespace EventBooking.BLL.Services
{
    /// <summary>
    /// Handles Stripe PaymentIntent creation and webhook processing.
    /// Reads Stripe:SecretKey and Stripe:WebhookSecret from IConfiguration.
    /// </summary>
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _db;
        private readonly string _webhookSecret;

        public PaymentService(AppDbContext db, IConfiguration config)
        {
            _db = db;

            var secretKey = config["Stripe:SecretKey"]
                ?? throw new InvalidOperationException(
                    "Stripe:SecretKey is not configured. Add it to appsettings.Development.json.");

            _webhookSecret = config["Stripe:WebhookSecret"] ?? string.Empty;

            // Set the global Stripe API key for this service's lifetime.
            // In production you'd inject a StripeClient instead of using global state.
            StripeConfiguration.ApiKey = secretKey;
        }

        /// <inheritdoc/>
        public async Task<PaymentIntentResult> CreatePaymentIntentAsync(int bookingId, decimal amount)
        {
            var booking = await _db.Bookings.FindAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking {bookingId} not found.");

            // Amount must be in the smallest currency unit (cents for USD)
            var amountInCents = (long)Math.Round(amount * 100, MidpointRounding.AwayFromZero);

            var service = new PaymentIntentService();

            // Per Stripe best practices: omit payment_method_types to enable
            // dynamic payment methods configured from the Stripe Dashboard.
            var options = new PaymentIntentCreateOptions
            {
                Amount = amountInCents,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
                Metadata = new Dictionary<string, string>
                {
                    { "bookingId", bookingId.ToString() }
                }
            };

            var intent = await service.CreateAsync(options);

            // Persist the Payment record (Pending until webhook confirms)
            var existingPayment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);
            if (existingPayment is not null)
            {
                // Replace any previous pending payment intent (e.g. user retried)
                existingPayment.StripePaymentIntentId = intent.Id;
                existingPayment.TransactionId = intent.Id;
                existingPayment.Amount = amount;
                existingPayment.Status = "Pending";
                existingPayment.PaymentDate = DateTime.UtcNow;
                _db.Payments.Update(existingPayment);
            }
            else
            {
                _db.Payments.Add(new Payment
                {
                    BookingId = bookingId,
                    Amount = amount,
                    PaymentDate = DateTime.UtcNow,
                    Status = "Pending",
                    StripePaymentIntentId = intent.Id,
                    TransactionId = intent.Id,
                });
            }

            await _db.SaveChangesAsync();

            return new PaymentIntentResult(intent.ClientSecret!, intent.Id);
        }

        /// <inheritdoc/>
        public async Task RefundPaymentAsync(int bookingId)
        {
            var payment = await _db.Payments
                .FirstOrDefaultAsync(p => p.BookingId == bookingId && p.Status == "Paid");

            if (payment is null) return; // No paid payment — nothing to refund

            if (!string.IsNullOrEmpty(payment.StripePaymentIntentId))
            {
                var refundService = new RefundService();
                var refundOptions = new RefundCreateOptions
                {
                    PaymentIntent = payment.StripePaymentIntentId,
                    // Omitting Amount = full refund
                };
                await refundService.CreateAsync(refundOptions);
            }

            // Mark payment as Refunded
            payment.Status = "Refunded";
            _db.Payments.Update(payment);

            // Mark booking as Refunded
            var booking = await _db.Bookings.FindAsync(bookingId);
            if (booking is not null)
            {
                booking.Status = "Refunded";
                _db.Bookings.Update(booking);
            }

            await _db.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task HandleWebhookAsync(string payload, string stripeSignature)
        {
            StripeEvent stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    payload,
                    stripeSignature,
                    _webhookSecret,
                    throwOnApiVersionMismatch: false);
            }
            catch (StripeException ex)
            {
                throw new InvalidOperationException($"Webhook signature verification failed: {ex.Message}", ex);
            }

            switch (stripeEvent.Type)
            {
                case EventTypes.PaymentIntentSucceeded:
                    await HandlePaymentSucceededAsync(stripeEvent);
                    break;

                case EventTypes.PaymentIntentPaymentFailed:
                    await HandlePaymentFailedAsync(stripeEvent);
                    break;

                // Other event types are acknowledged but ignored
            }
        }

        private async Task HandlePaymentSucceededAsync(StripeEvent stripeEvent)
        {
            var intent = (PaymentIntent)stripeEvent.Data.Object;
            await UpdatePaymentStatus(intent.Id, paymentStatus: "Paid", bookingStatus: "Confirmed");
        }

        private async Task HandlePaymentFailedAsync(StripeEvent stripeEvent)
        {
            var intent = (PaymentIntent)stripeEvent.Data.Object;
            await UpdatePaymentStatus(intent.Id, paymentStatus: "Failed", bookingStatus: "PaymentFailed");
        }

        private async Task UpdatePaymentStatus(string intentId, string paymentStatus, string bookingStatus)
        {
            var payment = await _db.Payments
                .FirstOrDefaultAsync(p => p.StripePaymentIntentId == intentId);

            if (payment is null) return; // Not our booking, ignore

            payment.Status = paymentStatus;
            _db.Payments.Update(payment);

            var booking = await _db.Bookings.FindAsync(payment.BookingId);
            if (booking is not null)
            {
                booking.Status = bookingStatus;
                _db.Bookings.Update(booking);
            }

            await _db.SaveChangesAsync();
        }
    }
}
