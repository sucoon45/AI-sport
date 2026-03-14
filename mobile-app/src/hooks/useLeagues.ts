import { useState, useEffect } from 'react';
import { api } from '../services/api.service';

export const useLeagues = () => {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        // We'll simulate fetching top leagues and their standings
        // In a real app, this would iterate through popular IDs
        const mockLeagues = [
          {
            id: 39,
            name: "Premier League",
            standings: [
              { pos: 1, team: "Man City", mp: 28, gd: "+42", pts: 68 },
              { pos: 2, team: "Liverpool", mp: 28, gd: "+38", pts: 65 },
              { pos: 3, team: "Arsenal", mp: 28, gd: "+35", pts: 64 },
              { pos: 4, team: "Aston Villa", mp: 28, gd: "+12", pts: 55 }
            ]
          },
          {
            id: 140,
            name: "La Liga",
            standings: [
              { pos: 1, team: "Real Madrid", mp: 28, gd: "+36", pts: 69 },
              { pos: 2, team: "Girona", mp: 28, gd: "+25", pts: 62 },
              { pos: 3, team: "Barcelona", mp: 28, gd: "+22", pts: 61 }
            ]
          }
        ];
        setLeagues(mockLeagues);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return { leagues, loading, error };
};
