import { Router } from 'express';
import * as predictionController from '../controllers/prediction.controller';

const router = Router();

router.get('/', predictionController.listPredictions);
router.get('/vip', predictionController.getVipPredictions);
router.get('/:matchId', predictionController.getPredictionForMatch);

export default router;
