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

// All biometrics routes require authentication
router.use(verifyToken);

// Get the latest biometrics
router.get('/', getBiometrics);

// Get biometrics history
router.get('/history', getBiometricsHistory);

// Create or update biometrics
router.post('/', rateLimiter, updateBiometrics);

// Add weight entry
router.post('/weight', rateLimiter, addWeightEntry);

// Add waist measurement entry
router.post('/waist', rateLimiter, addWaistEntry);

// Add body fat percentage entry
router.post('/bodyfat', rateLimiter, addBodyFatEntry);

export default router;
