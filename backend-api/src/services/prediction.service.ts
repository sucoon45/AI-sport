import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export const generatePrediction = async (homeStats: any, awayStats: any, leagueAvg: number = 1.35) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/predict`, {
      home_stats: homeStats,
      away_stats: awayStats,
      league_avg: leagueAvg
    });
    return response.data;
  } catch (error) {
    console.error('Error generating prediction from AI engine:', error);
    throw error;
  }
};
