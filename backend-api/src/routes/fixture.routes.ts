import { Router } from 'express';
import * as fixtureController from '../controllers/fixture.controller';

const router = Router();

router.get('/today', fixtureController.getTodaysFixtures);
router.get('/live', fixtureController.getLiveMatches);

export default router;
