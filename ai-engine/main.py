from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import os
import numpy as np
from dotenv import load_dotenv


load_dotenv()

from models.poisson_model import predict_match
from models.xgboost_model import ai_model

app = FastAPI(title="BetMind AI Prediction Engine")

class PredictionRequest(BaseModel):
    home_stats: dict
    away_stats: dict
    league_avg: float = 1.35

class PremiumRequest(BaseModel):
    match_features: dict

@app.get("/")
async def root():
    return {"message": "BetMind AI Prediction Engine is running"}

@app.post("/predict")
async def predict(request: PredictionRequest):
    probs = predict_match(request.home_stats, request.away_stats, request.league_avg)
    
    # Determine predicted score (most likely score)
    score_matrix = np.array(probs['score_matrix'])
    home_g, away_g = np.unravel_index(score_matrix.argmax(), score_matrix.shape)
    
    return {
        "home_win_probability": probs['home_win'],
        "draw_probability": probs['draw'],
        "away_win_probability": probs['away_win'],
        "predicted_score": f"{home_g}-{away_g}",
        "confidence": max(probs['home_win'], probs['draw'], probs['away_win'])
    }

@app.post("/predict/premium")
async def predict_premium(request: PremiumRequest):
    # This uses the XGBoost model for higher precision
    probs = ai_model.predict_outcome(request.match_features)
    return probs


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
