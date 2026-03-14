import { Request, Response } from 'express';
import * as predictionService from '../services/prediction.service';
import { supabase } from '../services/supabase';

export const getPredictionForMatch = async (req: Request, res: Response) => {
  const { matchId } = req.params;
  
  try {
    // 1. Fetch match from DB
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // 2. Fetch stats for both teams
    const { data: homeStats } = await supabase.from('team_stats').select('*').eq('team_id', match.home_team_id).single();
    const { data: awayStats } = await supabase.from('team_stats').select('*').eq('team_id', match.away_team_id).single();

    // Default stats if none found
    const hStats = homeStats || { attack_rating: 1.2, defense_rating: 1.0 };
    const aStats = awayStats || { attack_rating: 1.0, defense_rating: 1.2 };

    // 3. Call AI Engine via Service
    const aiResponse = await predictionService.generatePrediction(
      { attack: hStats.attack_rating, defense: hStats.defense_rating },
      { attack: aStats.attack_rating, defense: aStats.defense_rating },
      1.35 // League avg
    );

    // 4. Save prediction to DB for future reference/VIP use
    await supabase.from('predictions').insert({
      match_id: matchId,
      prediction_text: aiResponse.analysis,
      home_win_prob: aiResponse.home_win_prob,
      draw_prob: aiResponse.draw_prob,
      away_win_prob: aiResponse.away_win_prob,
      predicted_score: aiResponse.predicted_score,
      confidence_score: aiResponse.confidence,
      is_vip: aiResponse.confidence > 85 // Auto-mark high confidence as VIP
    });

    res.json({ success: true, data: aiResponse });
  } catch (error: any) {
    console.error('Prediction Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal error' });
  }
};

export const getVipPredictions = async (req: Request, res: Response) => {
  try {
    // This would fetch from a database or a curated list in a real app
    // For now, we simulate curated VIP predictions
    const mockVip = [
      {
        id: 'vip-1',
        match: 'Real Madrid vs Barcelona',
        league: 'La Liga',
        prediction: 'Home Win',
        odds: '2.10',
        confidence: '95%',
        isVip: true
      },
      {
        id: 'vip-2',
        match: 'Man City vs Arsenal',
        league: 'Premier League',
        prediction: 'Over 2.5 Goals',
        odds: '1.80',
        confidence: '92%',
        isVip: true
      }
    ];
    res.json({ success: true, data: mockVip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch VIP predictions' });
  }
};

export const listPredictions = async (req: Request, res: Response) => {
  const { category, isVip } = req.query;
  
  try {
    let query = supabase
      .from('predictions')
      .select('*, matches(*, home_team:teams(name), away_team:teams(name))')
      .order('created_at', { ascending: false });

    if (isVip === 'true') {
      query = query.eq('is_vip', true);
    }
    
    // In a real app we'd filter by category if match has it
    
    const { data, error } = await query.limit(20);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
