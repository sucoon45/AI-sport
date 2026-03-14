-- AI SPORT Wallet System

CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  balance DECIMAL DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallets(id),
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'bet_payment', 'vip_subscription'
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  reference TEXT UNIQUE, -- Payment gateway reference
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = wallet_id);

-- Trigger to create wallet on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();
