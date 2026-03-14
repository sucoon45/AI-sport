import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { isAdmin } from '../middleware/admin.middleware';

const router = Router();

// Apply admin middleware to all routes in this router
router.use(isAdmin);

router.get('/stats', adminController.getPlatformStats);
router.post('/broadcast', adminController.broadcastSignal);

export default router;
