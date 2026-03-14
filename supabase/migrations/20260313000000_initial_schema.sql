-- AI SPORT Initial Schema

-- Users Table (Extending auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free', -- 'free', 'vip'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Matches Table (Cached from API-Football)
CREATE TABLE IF NOT EXISTS public.matches (
  id BIGINT PRIMARY KEY,
  league_id INT,
  home_team_id INT,
  away_team_id INT,
  match_time TIMESTAMP WITH TIME ZONE,
  status TEXT,
  home_score INT,
  away_score INT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id BIGINT REFERENCES public.matches(id),
  prediction_text TEXT,
  home_win_prob DECIMAL,
  draw_prob DECIMAL,
  away_win_prob DECIMAL,
  predicted_score TEXT,
  is_vip BOOLEAN DEFAULT false,
  confidence_score INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public matches are viewable by everyone" ON public.matches
  FOR SELECT USING (true);

CREATE POLICY "Predictions viewable by authenticated users" ON public.predictions
  FOR SELECT USING (auth.role() = 'authenticated');
