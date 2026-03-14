import { supabase } from './supabase';

export const sendNotification = async (userId: string, title: string, message: string, type: string = 'info', metadata: any = {}) => {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      metadata
    });

    if (error) throw error;
    
    // In a real app, we'd also push to FCM (Firebase Cloud Messaging)
    console.log(`Notification sent to ${userId}: ${title}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const broadcastNotification = async (title: string, message: string, type: string = 'info', metadata: any = {}) => {
  try {
    // Fetch all users or specific segments
    const { data: profiles } = await supabase.from('profiles').select('id');
    
    if (profiles) {
      const notifications = profiles.map(p => ({
        user_id: p.id,
        title,
        message,
        type,
        metadata
      }));

      const { error } = await supabase.from('notifications').insert(notifications);
      if (error) throw error;
    }
    
    console.log(`Broadcasted notification: ${title}`);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
  }
};
