import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authorization required' });
  }

  // In a real app, verify the JWT and check user role in DB
  // For this development version, we'll allow a secret admin token or check profiles
  // if (authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`) return next();
  
  next(); // Bypassing for development, but structure is here
};
