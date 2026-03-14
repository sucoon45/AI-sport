import { Router } from 'express';
import * as referralController from '../controllers/referral.controller';

const router = Router();

router.post('/apply', referralController.applyReferral);
router.get('/stats/:userId', referralController.getReferralStats);

export default router;
