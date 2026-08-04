using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBooking.Web.Controllers.Api
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsApiController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsApiController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        /// <summary>
        /// POST /api/payments/create-intent
        /// Creates a Stripe PaymentIntent and returns the clientSecret to the frontend.
        /// Requires the user to be authenticated (Attendee role).
        /// </summary>
        [HttpPost("create-intent")]
        [Authorize(Roles = "Attendee")]
        public async Task<IActionResult> CreateIntent([FromBody] CreateIntentRequest req)
        {
            if (req.Amount <= 0)
                return BadRequest(new { error = "Amount must be positive." });

            try
            {
                var result = await _paymentService.CreatePaymentIntentAsync(req.BookingId, req.Amount);
                return Ok(new
                {
                    clientSecret = result.ClientSecret,
                    paymentIntentId = result.PaymentIntentId
                });
            }
            catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
        }

        /// <summary>
        /// POST /api/payments/webhook
        /// Receives Stripe webhook events (no auth — Stripe calls this directly).
        /// Signature is verified inside IPaymentService.HandleWebhookAsync.
        /// </summary>
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            // Read raw body — required for Stripe signature verification
            string payload;
            using (var reader = new StreamReader(Request.Body))
            {
                payload = await reader.ReadToEndAsync();
            }

            var signature = Request.Headers["Stripe-Signature"].ToString();

            if (string.IsNullOrEmpty(signature))
                return BadRequest("Missing Stripe-Signature header.");

            try
            {
                await _paymentService.HandleWebhookAsync(payload, signature);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                // Signature verification failure — return 400 so Stripe retries
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/payments/confirm
        /// Called by the frontend after stripe.confirmPayment() resolves without error.
        /// Verifies the PaymentIntent status with Stripe server-side, then marks the
        /// Booking as Confirmed and Payment as Paid.
        /// Idempotent — safe to call even if the webhook already processed it.
        /// </summary>
        [HttpPost("confirm")]
        [Authorize(Roles = "Attendee")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.PaymentIntentId))
                return BadRequest(new { error = "paymentIntentId is required." });

            try
            {
                await _paymentService.ConfirmPaymentAsync(req.PaymentIntentId);
                return Ok(new { message = "Booking confirmed." });
            }
            catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
        }
    }

    public record CreateIntentRequest(int BookingId, decimal Amount);
    public record ConfirmPaymentRequest(string PaymentIntentId);
}
