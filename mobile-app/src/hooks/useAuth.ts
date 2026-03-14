import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const demoSignIn = () => {
    // Creating a mock session for development/testing
    const mockSession: any = {
      user: {
        id: 'demo-user-123',
        email: 'test@aisport.com',
        user_metadata: { full_name: 'Test Admin' }
      },
      access_token: 'mock-token',
    };
    setSession(mockSession);
  };

  const signOut = async () => {
    if (session?.user?.id === 'demo-user-123') {
      setSession(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  return { session, loading, signOut, demoSignIn };
};
