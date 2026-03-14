import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class XGBoostPredictor:
    def __init__(self):
        self.model = xgb.XGBClassifier(
            max_depth=5,
            learning_rate=0.1,
            n_estimators=100,
            objective='multi:softprob',
            num_class=3 # Home, Draw, Away
        )

    def prepare_data(self, data_df):
        # Feature engineering: rolling averages, head-to-head, etc.
        # This is a placeholder for real feature extraction logic
        features = data_df[['home_avg_goals', 'away_avg_goals', 'home_win_rate', 'away_win_rate', 'h2h_advantage']]
        target = data_df['result'] # 0: Home, 1: Draw, 2: Away
        return features, target

    def train(self, historical_data):
        df = pd.DataFrame(historical_data)
        X, y = self.prepare_data(df)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        
        preds = self.model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"XGBoost Model Trained. Accuracy: {acc * 100:.2f}%")
        return acc

    def predict_outcome(self, match_features):
        # match_features should be a dict or list of same features as training
        features_df = pd.DataFrame([match_features])
        probs = self.model.predict_proba(features_df)[0]
        
        return {
            "home_win": float(probs[0]),
            "draw": float(probs[1]),
            "away_win": float(probs[2]),
            "confidence": float(np.max(probs))
        }

# Singleton instance
ai_model = XGBoostPredictor()
