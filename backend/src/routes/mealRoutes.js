import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    getFoodsByCategory,
    getFoodCategories,
    createMealPlan,
    getMealPlans,
    deleteMealPlan,
    seedFoods
} from '../controllers/mealController.js';

const router = express.Router();

// Get foods by category
router.get('/foods', getFoodsByCategory);

// Get food categories
router.get('/categories', getFoodCategories);

// Seed foods (development only)
router.post('/seed', seedFoods);

// Protected routes


// Create meal plan
router.post('/plans', createMealPlan);

// Get user's meal plans
router.get('/plans', getMealPlans);

// Delete meal plan
router.delete('/plans/:id', deleteMealPlan);

export default router;
