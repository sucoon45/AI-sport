# SportAI - Football Prediction & Auto-Betting

SportAI is a high-performance, automated platform designed to analyze football match data, generate predictions using machine learning, and automatically execute bets on supported bookmakers like SportyBet.

## ✨ Features

- **AI-Powered Predictions**: Using historical match data, team form, and head-to-head statistics.
- **Automated Betting**: Playwright-based bot for SportyBet that executes bets based on AI high-confidence signals.
- **Advanced Dashboard**: Real-time stats, profit curves, and match radar.
- **Bankroll Management**: Smart risk rules with 2% stake limits and daily stop-loss protection.
- **Odds Comparison**: Automatically selects the best odds from integrated bookmakers.

## 🚀 Getting Started

### 1. Requirements
- Node.js 18 or 20
- Python 3.9+
- API-Football (RapidAPI) Key

### 2. Frontend Installation (Next.js)
```bash
npm install
npm run dev
```

### 3. AI Predictive Model (Python)
Install dependencies and prepare the model:
```bash
cd ai_engine
pip install pandas scikit-learn joblib
python predictor.py
```

### 4. Automation Bot (Playwright)
Install browser binaries for automation:
```bash
npx playwright install chromium
```

### 5. Environment Variables
Create a `.env.local` with the following:
```env
FOOTBALL_API_KEY=your_rapidapi_key
BET_USERNAME=your_sportybet_phone
BET_PASSWORD=your_sportybet_password
DATABASE_URL=your_supabase_postgres_url
```

## 🛡️ Risk Disclosure
Betting involves risk. This system uses machine learning probabilities but cannot guarantee outcome results. Always use the provided bankroll management limits and never bet more than you can afford to lose.

## 📄 License
MIT License. Created for Kamirex.
