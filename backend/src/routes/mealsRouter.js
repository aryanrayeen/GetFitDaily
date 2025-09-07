console.log('mealsRouter.js loaded, constructing router...');
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
    getFoodsByCategory, 
    getFoodCategories, 
    createMealPlan, 
    getMealPlans, 
    deleteMealPlan, 
    seedFoods 
} from '../controllers/mealController.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    console.log('Meal test route called');
    res.json({ message: 'Meal routes are working!' });
});

// Get all food categories
router.get('/categories', getFoodCategories);

// Get all foods by category
router.get('/foods', getFoodsByCategory);

// Seed foods data (for development)
router.post('/seed', seedFoods);

// Protected routes - require authentication
router.use(verifyToken);

// Get user's meal plans
router.get('/plans', getMealPlans);

// Create a new meal plan
router.post('/plans', createMealPlan);

// Delete a meal plan
router.delete('/plans/:id', deleteMealPlan);

export default router;
