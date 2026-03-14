import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // Update with your local IP for physical devices

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getFixtures = async () => {
  try {
    const response = await api.get('/fixtures/today');
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getLiveScores = async () => {
  try {
    const response = await api.get('/fixtures/live');
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getPredictions = async (category?: string, isVip?: boolean) => {
  try {
    const response = await api.get('/predictions', {
      params: { category, isVip }
    });
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getVipPredictions = async () => {
  try {
    const response = await api.get('/predictions/vip');
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getPredictionForMatchId = async (matchId: number) => {
  try {
    const response = await api.get(`/predictions/${matchId}`);
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createDepositIntent = async (amount: number, method: 'stripe' | 'paystack', userId: string) => {
  try {
    const response = await api.post('/payments/deposit', { amount, method, userId });
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
