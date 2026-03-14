-- AI Sport Prediction App Schema

-- 1. Leagues Table
CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    logo_url TEXT,
    api_id INTEGER UNIQUE, -- ID from external API (API-Football)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Teams Table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    logo_url TEXT,
    api_id INTEGER UNIQUE,
    venue_name VARCHAR(255),
    city VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Matches (Fixtures) Table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    api_id INTEGER UNIQUE,
    league_id INTEGER REFERENCES leagues(id),
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50), -- timed, finished, in_play, postponed
    venue VARCHAR(255),
    home_score INTEGER,
    away_score INTEGER,
    round VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Predictions Table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    prediction_type VARCHAR(50), -- home_win, draw, away_win, btts, over_2_5
    confidence FLOAT, -- 0.0 to 1.0
    home_win_prob FLOAT,
    draw_prob FLOAT,
    away_win_prob FLOAT,
    predicted_score VARCHAR(10),
    analysis TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    result_status VARCHAR(50) DEFAULT 'pending', -- won, lost, void
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users
    plan_type VARCHAR(50) NOT NULL, -- free, daily_vip, monthly_premium
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active', -- active, expired, cancelled
    payment_id VARCHAR(255) -- Reference to Stripe/Paystack transaction
);

-- 6. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- prediction_alert, match_start, goal_alert
    is_read BOOLEAN DEFAULT FALSE,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Odds Table
CREATE TABLE odds (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    bookmaker_name VARCHAR(255),
    home_win_odds FLOAT,
    draw_odds FLOAT,
    away_win_odds FLOAT,
    over_2_5_odds FLOAT,
    under_2_5_odds FLOAT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_predictions_match ON predictions(match_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
