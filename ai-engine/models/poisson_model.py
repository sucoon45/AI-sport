import numpy as np
from scipy.stats import poisson

def calculate_probabilities(home_expected, away_expected, max_goals=5):
    """
    Calculate match outcome probabilities using Poisson distribution.
    
    Args:
        home_expected: Average goals expected for home team
        away_expected: Average goals expected for away team
        max_goals: Maximum number of goals to consider for score grid
        
    Returns:
        dict: Probabilities for home win, draw, and away win
    """
    # Probability matrices
    home_probs = [poisson.pmf(i, home_expected) for i in range(max_goals + 1)]
    away_probs = [poisson.pmf(i, away_expected) for i in range(max_goals + 1)]
    
    # Outer product to get matrix of all possible scores
    score_matrix = np.outer(home_probs, away_probs)
    
    # Outcome probabilities
    draw_prob = np.sum(np.diag(score_matrix))
    home_win_prob = np.sum(np.tril(score_matrix, -1))
    away_win_prob = np.sum(np.triu(score_matrix, 1))
    
    # Normalize (optional, as pmf sums to ~1 up to max_goals)
    total = home_win_prob + draw_prob + away_win_prob
    
    return {
        "home_win": float(home_win_prob / total),
        "draw": float(draw_prob / total),
        "away_win": float(away_win_prob / total),
        "score_matrix": score_matrix.tolist()
    }

def predict_match(home_stats, away_stats, league_avg_goals=1.5):
    """
    Placeholder for a more complex calculation that takes team form into account.
    """
    # Simplified logic: use average goals scored/conceded
    home_attack = home_stats.get('attack_strength', 1.0)
    away_defense = away_stats.get('defense_strength', 1.0)
    
    away_attack = away_stats.get('attack_strength', 1.0)
    home_defense = home_stats.get('defense_strength', 1.0)
    
    home_lambda = home_attack * away_defense * league_avg_goals
    away_lambda = away_attack * home_defense * league_avg_goals
    
    return calculate_probabilities(home_lambda, away_lambda)
