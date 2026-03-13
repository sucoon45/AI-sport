import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import json

class FootballPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        
    def preprocess_data(self, matches_df):
        """
        Featurize the data:
        - Team form (last 5 games)
        - Head-to-head records
        - Goals scored/conceded averages
        - Home vs Away advantage
        """
        # Placeholder for real preprocessing logic
        features = matches_df[['home_team_form', 'away_team_form', 'home_avg_goals', 'away_avg_goals', 'h2h_advantage']]
        labels = matches_df['match_result'] # 0 for draw, 1 for home win, 2 for away win
        return features, labels

    def train(self, historical_data_file):
        df = pd.read_csv(historical_data_file)
        X, y = self.preprocess_data(df)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        predictions = self.model.predict(X_test)
        print(f"Model Training Complete. Accuracy: {accuracy_score(y_test, predictions):.2f}")
        
        # Save model
        joblib.dump(self.model, 'football_model.pkl')

    def predict_outcome(self, match_data):
        """
        Takes real-time match stats and returns probabilities.
        """
        model = joblib.load('football_model.pkl')
        probs = model.predict_proba([match_data])[0]
        
        results = {
            "Home Win": float(probs[1]),
            "Draw": float(probs[0]),
            "Away Win": float(probs[2])
        }
        
        recommended_bet = max(results, key=results.get)
        confidence = results[recommended_bet]
        
        return {
            "probabilities": results,
            "recommended_bet": recommended_bet,
            "confidence_level": "High" if confidence > 0.6 else "Medium" if confidence > 0.4 else "Low"
        }

if __name__ == "__main__":
    # Example usage
    predictor = FootballPredictor()
    # In practice, you'd load real data here
    # predictor.train('match_data.csv')
    
    # Mock match prediction
    mock_match = [0.8, 0.4, 2.1, 1.2, 0.5] # Featurized data
    # print(predictor.predict_outcome(mock_match))
