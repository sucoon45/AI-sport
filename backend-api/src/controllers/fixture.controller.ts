import { Request, Response } from 'express';
import * as footballService from '../services/football.service';

export const getTodaysFixtures = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const fixtures = await footballService.getFixtures(today);
    res.json({ success: true, data: fixtures });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch fixtures' });
  }
};

export const getLiveMatches = async (req: Request, res: Response) => {
  try {
    const liveMatches = await footballService.getLiveScores();
    res.json({ success: true, data: liveMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch live scores' });
  }
};
