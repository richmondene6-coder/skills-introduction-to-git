import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

/** Lets the full flow run locally without Stripe keys. Never active in production. */
export const devPaymentBypass = !stripe && process.env.NODE_ENV !== "production";
