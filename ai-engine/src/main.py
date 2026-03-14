from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import numpy as np
from scipy.stats import poisson

app = FastAPI(title="AI Sport Prediction Engine v2")

class PredictionRequest(BaseModel):
    home_stats: Dict[str, float] # e.g., {"attack": 1.5, "defense": 0.8}
    away_stats: Dict[str, float]
    league_avg: float = 1.35 # avg goals per team per match

class PredictionResponse(BaseModel):
    home_win_prob: float
    draw_prob: float
    away_win_prob: float
    predicted_score: str
    confidence: float
    analysis: str

def calculate_poisson_probs(home_exp: float, away_exp: float, max_goals: int = 6):
    """Calculate match outcome probabilities using Poisson distribution."""
    prob_matrix = np.outer(
        poisson.pmf(np.arange(max_goals + 1), home_exp),
        poisson.pmf(np.arange(max_goals + 1), away_exp)
    )
    
    draw_prob = np.sum(np.diag(prob_matrix))
    home_win_prob = np.sum(np.triu(prob_matrix, 1)) # Away win in numpy outer is upper triangle if we do (home, away)
    # Correction: np.outer(home, away) -> rows are home, cols are away
    # home_win if home > away (lower triangle)
    home_win_prob = np.sum(np.tril(prob_matrix, -1))
    away_win_prob = np.sum(np.triu(prob_matrix, 1))
    
    # Find most likely score
    idx = np.unravel_index(np.argmax(prob_matrix), prob_matrix.shape)
    predicted_score = f"{idx[0]} - {idx[1]}"
    
    return float(home_win_prob), float(draw_prob), float(away_win_prob), predicted_score

@app.post("/predict", response_model=PredictionResponse)
async def predict(req: PredictionRequest):
    try:
        # Calculate expected goals (simplified model)
        # Expected = LeagueAvg * (TeamAttack / LeagueAvg) * (OpponentDefense / LeagueAvg)
        # Simplified: home_exp = home_attack * away_defense
        
        home_attack = req.home_stats.get("attack", 1.0)
        home_defense = req.home_stats.get("defense", 1.0)
        away_attack = req.away_stats.get("attack", 1.0)
        away_defense = req.away_stats.get("defense", 1.0)
        
        home_exp = req.league_avg * home_attack * away_defense
        away_exp = req.league_avg * away_attack * home_defense
        
        h_win, draw, a_win, score = calculate_poisson_probs(home_exp, away_exp)
        
        # Normalize to 100%
        total = h_win + draw + a_win
        h_win /= total
        draw /= total
        a_win /= total
        
        confidence = max(h_win, a_win, draw) * 100
        
        analysis = (
            f"Based on Poisson distribution: Home expected goals {home_exp:.2f}, "
            f"Away expected goals {away_exp:.2f}. "
            f"{'Strong home advantage detected.' if h_win > 0.5 else 'Tight match expected.'}"
        )

        return {
            "home_win_prob": round(h_win, 3),
            "draw_prob": round(draw, 3),
            "away_win_prob": round(a_win, 3),
            "predicted_score": score,
            "confidence": round(confidence, 1),
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
