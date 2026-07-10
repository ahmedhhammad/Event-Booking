namespace EventBooking.BLL.Services
{
    public interface IPaymentService
    {
        /// <summary>
        /// Creates a Stripe PaymentIntent for the given booking and amount.
        /// Stores a Payment record (Status=Pending) in the database.
        /// Returns the PaymentIntent client_secret to pass to the frontend.
        /// </summary>
        Task<PaymentIntentResult> CreatePaymentIntentAsync(int bookingId, decimal amount);

        /// <summary>
        /// Handles a raw Stripe webhook payload.
        /// Verifies the signature and updates Booking + Payment status based on the event type.
        /// </summary>
        Task HandleWebhookAsync(string payload, string stripeSignature);
    }

    public record PaymentIntentResult(string ClientSecret, string PaymentIntentId);
}
