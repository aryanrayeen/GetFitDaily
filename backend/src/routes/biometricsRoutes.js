import express from 'express';
import { 
    getBiometrics, 
    updateBiometrics, 
    getBiometricsHistory,
    addWeightEntry,
    addWaistEntry,
    addBodyFatEntry 
} from '../controllers/biometricsController.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();


router.use(verifyToken);
router.get('/', getBiometrics);
router.get('/history', getBiometricsHistory);
router.post('/', rateLimiter, updateBiometrics);
router.post('/weight', rateLimiter, addWeightEntry);
router.post('/bodyfat', rateLimiter, addBodyFatEntry);

export default router;
