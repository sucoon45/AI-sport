import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { supabase } from '../services/supabase';

export const createDepositIntent = async (req: Request, res: Response) => {
  const { amount, method, userId } = req.body;

  try {
    if (method === 'stripe') {
      const intent = await paymentService.createStripePaymentIntent(amount, 'usd', { userId, type: 'deposit' });
      return res.json({ success: true, data: { clientSecret: intent.client_secret, id: intent.id } });
    } else if (method === 'paystack') {
      // For Paystack we usually need the user email
      const { data: profile } = await supabase.from('profiles').select('email').eq('id', userId).single();
      const email = profile?.email || 'user@example.com';
      
      const response = await paymentService.initializePaystackTransaction(email, amount, { userId, type: 'deposit' });
      return res.json({ success: true, data: response.data });
    }

    res.status(400).json({ success: false, message: 'Invalid payment method' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const event = req.body;
  // Note: Real webhook validation would check signatures here (Stripe-Signature or X-Paystack-Signature)
  
  try {
    // 1. Handle Stripe Events
    if (event.type === 'payment_intent.succeeded') {
      const { userId, type } = event.data.object.metadata;
      const amount = event.data.object.amount / 100;
      
      await processSuccessfulPayment(userId, amount, type, event.data.object.id);
    }
    
    // 2. Handle Paystack Events
    if (event.event === 'charge.success') {
      const { userId, type } = event.data.metadata;
      const amount = event.data.amount / 100;
      
      await processSuccessfulPayment(userId, amount, type, event.data.reference);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

async function processSuccessfulPayment(userId: string, amount: number, type: string, reference: string) {
  // Update wallet or subscription
  if (type === 'deposit') {
    // Increment wallet balance
    const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', userId).single();
    const newBalance = (wallet?.balance || 0) + amount;
    
    await supabase.from('wallets').update({ balance: newBalance }).eq('id', userId);
    
    // Log transaction
    await supabase.from('transactions').insert({
      wallet_id: userId,
      amount,
      type: 'deposit',
      status: 'completed',
      reference
    });

    // Handle Referral Bonus (New in Phase 5)
    const { data: profile } = await supabase.from('profiles').select('referred_by').eq('id', userId).single();
    if (profile?.referred_by) {
      const bonusRate = 0.10; // 10% bonus
      const bonusAmount = amount * bonusRate;
      
      // Update Referrer's Wallet
      const { data: refWallet } = await supabase.from('wallets').select('balance').eq('id', profile.referred_by).single();
      const newRefBalance = (refWallet?.balance || 0) + bonusAmount;
      await supabase.from('wallets').update({ balance: newRefBalance }).eq('id', profile.referred_by);
      
      // Mark referral record as completed
      await supabase.from('referrals').update({ 
        status: 'completed',
        bonus_amount: bonusAmount 
      }).eq('referee_id', userId);
      
      // Log referral transaction for referrer
      await supabase.from('transactions').insert({
        wallet_id: profile.referred_by,
        amount: bonusAmount,
        type: 'referral_bonus',
        status: 'completed',
        reference: `REF-${reference}`
      });
    }
  } else if (type === 'subscription') {
    await supabase.from('profiles').update({ subscription_status: 'vip' }).eq('id', userId);
  }
}
