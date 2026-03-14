import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user from Supabase/Auth
    const fetchUser = () => {
      setLoading(true);
      setTimeout(() => {
        setUser({
          name: "Alex Thompson",
          email: "alex.t@ai-sport.com",
          plan: "Free Plan",
          avatar: null,
          isPremium: false,
          stats: {
            predictionsUsed: 12,
            winRate: "75%"
          }
        });
        setLoading(false);
      }, 1000);
    };

    fetchUser();
  }, []);

  const togglePremium = () => {
    setUser((prev: any) => ({
      ...prev,
      isPremium: !prev.isPremium,
      plan: !prev.isPremium ? "VIP Member" : "Free Plan"
    }));
  };

  return { user, loading, togglePremium };
};
