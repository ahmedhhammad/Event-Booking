import { loadStripe } from '@stripe/stripe-js';

/**
 * Singleton Stripe.js instance.
 * The publishable key is read from the Vite environment at build time.
 * Never use the secret key here — only the publishable key is safe for the client.
 */
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

if (!stripePublishableKey) {
  console.warn(
    '[Stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set. ' +
    'Add it to frontend/.env — see frontend/.env.example for reference.'
  );
}

export const stripePromise = loadStripe(stripePublishableKey ?? '');
