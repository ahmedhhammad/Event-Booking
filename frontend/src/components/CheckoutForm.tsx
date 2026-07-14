import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  totalAmount: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

/**
 * Embedded Stripe Payment Element form.
 *
 * This component must be rendered inside a <Elements> provider
 * (see BookingCheckoutPage which wraps it with the clientSecret).
 *
 * Uses the Payment Element (not the legacy Card Element) per Stripe best practices.
 * Supports all payment methods configured in the Stripe Dashboard.
 */
export function CheckoutForm({ totalAmount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return; // Stripe.js not yet loaded

    setLoading(true);
    setErrorMsg(null);

    // Trigger form validation inside the Payment Element
    const { error: submitError } = await elements.submit();
    if (submitError) {
      const msg = submitError.message ?? 'Please check your payment details.';
      setErrorMsg(msg);
      onError(msg);
      setLoading(false);
      return;
    }

    // Confirm the payment — Stripe handles 3DS and redirects automatically
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // After redirect-based payment methods (e.g. bank redirect), return here
        return_url: `${window.location.origin}/dashboard?payment=complete`,
      },
      // For card payments, don't redirect — stay on the page and handle inline
      redirect: 'if_required',
    });

    if (error) {
      // Payment failed or was declined
      const msg = error.message ?? 'Payment failed. Please try again.';
      setErrorMsg(msg);
      onError(msg);
      setLoading(false);
    } else {
      // Payment succeeded
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe Payment Element — renders card, Apple Pay, etc. */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Inline error */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" />
            Pay ${totalAmount.toFixed(2)}
          </>
        )}
      </button>

    </form>
  );
}
