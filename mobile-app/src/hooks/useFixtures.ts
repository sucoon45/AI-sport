import { useState, useEffect } from 'react';
import { getFixtures, getLiveScores } from '../services/api.service';

export const useFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const data = await getFixtures();
      setFixtures(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  return { fixtures, loading, error, refresh: fetchFixtures };
};
