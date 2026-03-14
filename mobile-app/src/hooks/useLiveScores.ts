import { useState, useEffect } from 'react';
import { getLiveScores } from '../services/api.service';

export const useLiveScores = () => {
  const [liveScores, setLiveScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveScores = async () => {
    try {
      const data = await getLiveScores();
      setLiveScores(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return { liveScores, loading, error, refresh: fetchLiveScores };
};
