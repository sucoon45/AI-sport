from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import joblib
import numpy as np
import os

app = FastAPI(title="SportAI Prediction Engine")

# Model configuration
MODEL_PATH = 'football_model.pkl'

class MatchFeatures(BaseModel):
    features: List[float] # [home_form, away_form, home_avg_goals, away_avg_goals, h2h_advantage]

@app.get("/")
async def root():
    return {"status": "Master Engine Active", "version": "1.0.0"}

@app.post("/predict")
async def predict(match: MatchFeatures):
    if not os.path.exists(MODEL_PATH):
        # Fallback if model isn't trained yet
        probs = np.random.dirichlet(np.ones(3), size=1)[0]
        prediction = ["Draw", "Home Win", "Away Win"][np.argmax(probs)]
        confidence = float(np.max(probs))
    else:
        try:
            model = joblib.load(MODEL_PATH)
            probs = model.predict_proba([match.features])[0]
            prediction = ["Draw", "Home Win", "Away Win"][np.argmax(probs)]
            confidence = float(np.max(probs))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {
        "prediction": prediction,
        "confidence": confidence,
        "probabilities": {
            "Draw": float(probs[0]),
            "Home Win": float(probs[1]),
            "Away Win": float(probs[2])
        },
        "signal": "STRONG" if confidence > 0.65 else "MODERATE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
