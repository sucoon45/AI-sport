import { Request, Response } from 'express';
import { supabase } from '../services/supabase';

export const applyReferral = async (req: Request, res: Response) => {
  const { userId, referralCode } = req.body;

  try {
    // 1. Find the referrer
    const { data: referrer, error: refError } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (refError || !referrer) {
      return res.status(404).json({ success: false, message: 'Invalid referral code' });
    }

    if (referrer.id === userId) {
      return res.status(400).json({ success: false, message: 'Cannot refer yourself' });
    }

    // 2. Update the referee (the current user)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referred_by: referrer.id })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 3. Create referral record
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referee_id: userId,
        status: 'pending',
        bonus_amount: 10.00 // Initial signup bonus placeholder
      });

    if (insertError) throw insertError;

    res.json({ success: true, message: 'Referral code applied successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReferralStats = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const { data, count, error } = await supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('referrer_id', userId);

    if (error) throw error;

    const totalEarned = data?.reduce((sum, r) => sum + (r.bonus_amount || 0), 0) || 0;

    res.json({
      success: true,
      data: {
        totalReferrals: count,
        totalEarned,
        referrals: data
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
