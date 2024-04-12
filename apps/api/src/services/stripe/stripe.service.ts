import Stripe from 'stripe';

export default new Stripe(String(process.env.STRIPE_SECRET_KEY));
