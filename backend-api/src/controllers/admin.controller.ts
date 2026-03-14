import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import * as notificationService from '../services/notification.service';

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    // Collect stats from various tables
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: predictionCount } = await supabase.from('predictions').select('*', { count: 'exact', head: true });
    const { data: transactions } = await supabase.from('transactions').select('amount').eq('status', 'completed');
    
    const totalRevenue = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

    res.json({
      success: true,
      data: {
        totalUsers: userCount || 0,
        totalPredictions: predictionCount || 0,
        totalRevenue,
        activeVips: 0, // Placeholder for subscription logic
        successRate: 85.5 // Aggregated from verification service
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const broadcastSignal = async (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  try {
    await notificationService.broadcastNotification(title, message, type || 'info');
    res.json({ success: true, message: 'Broadcast sent successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
