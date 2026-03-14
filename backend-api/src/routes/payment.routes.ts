import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/deposit', paymentController.createDepositIntent);
router.post('/webhook', paymentController.handleWebhook);

export default router;
