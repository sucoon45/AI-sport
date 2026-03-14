-- AI SPORT Stats Schema

CREATE TABLE IF NOT EXISTS public.teams (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  country TEXT
);

CREATE TABLE IF NOT EXISTS public.team_stats (
  team_id INT REFERENCES public.teams(id) PRIMARY KEY,
  attack_rating DECIMAL DEFAULT 1.0,
  defense_rating DECIMAL DEFAULT 1.0,
  overall_rating DECIMAL DEFAULT 0.5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public stats are viewable by everyone" ON public.team_stats FOR SELECT USING (true);
