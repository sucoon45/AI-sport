import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client (Placeholder)
// const supabaseUrl = process.env.SUPABASE_URL || '';
// const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseKey);

import fixtureRoutes from './routes/fixture.routes';
import predictionRoutes from './routes/prediction.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import referralRoutes from './routes/referral.routes';
import { initScheduler } from './services/scheduler.service';

initScheduler();

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'BetMind AI Backend API is running' });
});

// Routes
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/referrals', referralRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
