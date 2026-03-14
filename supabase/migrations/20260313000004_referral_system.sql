-- Add referral code to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);

-- Generate referral codes for existing users (simple fragment of ID)
UPDATE profiles SET referral_code = substring(id::text, 1, 8) WHERE referral_code IS NULL;

-- Create referrals table to track bonuses
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles(id) NOT NULL,
  referee_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed
  bonus_amount DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(referee_id) -- A user can only be referred once
);

-- RLS for referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own referral stats"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Trigger to generate referral code for new users
CREATE OR REPLACE FUNCTION handle_new_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := substring(NEW.id::text, 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created_referral
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_new_referral_code();
