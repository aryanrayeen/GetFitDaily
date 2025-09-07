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
router.get('/foods', getFoodsByCategory);
router.post('/seed', seedFoods);
router.use(verifyToken);
router.get('/plans', getMealPlans);
router.post('/plans', createMealPlan);
router.delete('/plans/:id', deleteMealPlan);

export default router;
