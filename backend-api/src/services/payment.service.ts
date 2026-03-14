import axios from 'axios';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY || '';

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2026-02-25.clover' as any, // Fix type mismatch or use specific version type
});

export const createStripePaymentIntent = async (amount: number, currency: string = 'usd', metadata: any = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      metadata,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    throw error;
  }
};

export const createStripeCheckout = async (userId: string, planId: string, successUrl: string, cancelUrl: string) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId, // This would be the Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
    });
    return session;
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    throw error;
  }
};

export const initializePaystackTransaction = async (email: string, amount: number, metadata: any = {}) => {
  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: Math.round(amount * 100), // in kobo
      metadata
    }, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
};

export const verifyPaystackTransaction = async (reference: string) => {
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
};
