import { useState, useEffect } from 'react';
import { getPredictions } from '../services/api.service';

export const usePredictions = (category = 'All') => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        // Map UI categories to backend filter if necessary
        const isVip = category === 'VIP';
        let data = await getPredictions(category === 'All' || isVip ? undefined : category, isVip);
        
        // If backend returns empty (e.g. fresh DB), fallback to augmented mock for demo richness
        if (!data || data.length === 0) {
           // Augmented mock logic for demo
           data = [
             {
               id: 'mock-1',
               match: 'Real Madrid vs Barcelona',
               league: 'La Liga',
               prediction: 'Home Win',
               odds: '2.10',
               confidence: '88%',
               isVip: category === 'VIP',
               category: 'Win/Draw/Loss'
             },
             {
              id: 'mock-2',
              match: 'Arsenal vs Man City',
              league: 'Premier League',
              prediction: 'Over 2.5 Goals',
              odds: '1.85',
              confidence: '82%',
              isVip: category === 'VIP',
              category: 'Over/Under'
            }
           ];
        }

        setPredictions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [category]);

  return { predictions, loading, error };
};
