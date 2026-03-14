import { useState, useEffect } from 'react';
import { api } from '../services/api.service';

export const useMatchDetails = (matchId: number) => {
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId) return;
      
      try {
        setLoading(true);
        // In a real app, we'd have a specific endpoint for match details
        // For now, we fetch from fixtures and add details
        const response = await api.get(`/fixtures/today`);
        const todayFixtures = response.data.data;
        const found = todayFixtures.find((f: any) => f.fixture.id === matchId);
        
        if (found) {
          // Add mock AI data and stats since API-Football might not have them in simple fixture list
          setMatch({
            ...found,
            aiPrediction: {
              winProb: { home: 0.45, draw: 0.25, away: 0.30 },
              predictedScore: "2 - 1",
              confidence: "82%",
              analysis: "Host team shows better tactical discipline in recent matches."
            },
            stats: {
              possession: { home: "55%", away: "45%", progress: 0.55 },
              shotsOnTarget: { home: "5", away: "3", progress: 0.62 },
              corners: { home: "7", away: "4", progress: 0.63 }
            }
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  return { match, loading, error };
};
