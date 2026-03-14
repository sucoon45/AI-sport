import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  },
});

export const getFixtures = async (date: string) => {
  try {
    const response = await apiClient.get('/fixtures', {
      params: { date },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    throw error;
  }
};

export const getLiveScores = async () => {
  try {
    const response = await apiClient.get('/fixtures', {
      params: { live: 'all' },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching live scores:', error);
    throw error;
  }
};

export const getTeamStats = async (teamId: number, leagueId: number, season: number) => {
  try {
    const response = await apiClient.get('/teams/statistics', {
      params: { team: teamId, league: leagueId, season },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching team stats:', error);
    throw error;
  }
};

export const getFinishedMatches = async (date: string) => {
  try {
    const response = await apiClient.get('/fixtures', {
      params: { date, status: 'FT' },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching finished matches:', error);
    throw error;
  }
};
