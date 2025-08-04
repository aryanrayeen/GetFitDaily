import express from 'express';
import { getBiometrics, updateBiometrics } from '../controllers/biometricsController.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

// Get the latest biometrics
router.get('/', getBiometrics);

// Create or update biometrics
router.post('/', rateLimiter, updateBiometrics);

export default router;
