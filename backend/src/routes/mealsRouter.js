console.log('mealsRouter.js loaded, constructing router...');
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Food from '../models/Food.js';
import MealPlan from '../models/MealPlan.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    console.log('Meal test route called');
    res.json({ message: 'Meal routes are working!' });
});

// Get all food categories
router.get('/categories', async (req, res) => {
    try {
        console.log('=== CATEGORIES ROUTE CALLED ===');
        const categories = await Food.distinct('category');
        console.log('Categories found:', categories);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all foods by category
router.get('/foods', async (req, res) => {
    try {
        const { category } = req.query;
        console.log('=== FOODS ROUTE CALLED ===');
        const query = category ? { category } : {};
        const foods = await Food.find(query).sort({ name: 1 });
        console.log(`Found ${foods.length} foods for category: ${category}`);
        res.json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Seed foods data (for development)
router.post('/seed', async (req, res) => {
    try {
        console.log('=== SEED ROUTE CALLED ===');
        const foods = [
            { name: 'Chicken Breast', category: 'proteins', calories: 165, protein: 31, serving: '100g' },
            { name: 'Salmon', category: 'proteins', calories: 208, protein: 25, serving: '100g' },
            { name: 'Eggs', category: 'proteins', calories: 155, protein: 13, serving: '100g' },
            { name: 'Tuna', category: 'proteins', calories: 132, protein: 28, serving: '100g' },
            { name: 'Greek Yogurt', category: 'proteins', calories: 59, protein: 10, serving: '100g' },
            { name: 'Brown Rice', category: 'carbs', calories: 111, protein: 3, serving: '100g' },
            { name: 'Oats', category: 'carbs', calories: 68, protein: 2, serving: '100g' },
            { name: 'Sweet Potato', category: 'carbs', calories: 86, protein: 2, serving: '100g' },
            { name: 'Whole Wheat Bread', category: 'carbs', calories: 247, protein: 13, serving: '100g' },
            { name: 'Broccoli', category: 'vegetables', calories: 34, protein: 3, serving: '100g' },
            { name: 'Spinach', category: 'vegetables', calories: 23, protein: 3, serving: '100g' },
            { name: 'Capsicum', category: 'vegetables', calories: 31, protein: 1, serving: '100g' },
            { name: 'Carrots', category: 'vegetables', calories: 41, protein: 1, serving: '100g' },
            { name: 'Tomatoes', category: 'vegetables', calories: 18, protein: 1, serving: '100g' },
            { name: 'Cucumber', category: 'vegetables', calories: 16, protein: 1, serving: '100g' },
            { name: 'Banana', category: 'fruits', calories: 89, protein: 1, serving: '100g' },
            { name: 'Apple', category: 'fruits', calories: 52, protein: 0, serving: '100g' },
            { name: 'Berries', category: 'fruits', calories: 57, protein: 1, serving: '100g' },
            { name: 'Orange', category: 'fruits', calories: 47, protein: 1, serving: '100g' },
            { name: 'Avocado', category: 'fruits', calories: 160, protein: 2, serving: '100g' },
            { name: 'Milk', category: 'dairy', calories: 42, protein: 3, serving: '100ml' },
            { name: 'Cheese', category: 'dairy', calories: 113, protein: 7, serving: '100g' },
            { name: 'Cottage Cheese', category: 'dairy', calories: 98, protein: 11, serving: '100g' },
            { name: 'Almonds', category: 'snacks', calories: 579, protein: 21, serving: '100g' },
            { name: 'Peanut Butter', category: 'snacks', calories: 588, protein: 25, serving: '100g' },
            { name: 'Protein Bar', category: 'snacks', calories: 400, protein: 20, serving: '100g' }
        ];
        await Food.deleteMany({});
        await Food.insertMany(foods);
        res.json({ message: 'Foods seeded successfully', count: foods.length });
    } catch (error) {
        console.error('Error seeding foods:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Protected routes - require authentication
router.use(verifyToken);

// Get user's meal plans
router.get('/plans', async (req, res) => {
    try {
        console.log('=== GET MEAL PLANS ROUTE CALLED ===');
        console.log('User ID:', req.userId);
        
        const mealPlans = await MealPlan.find({ user: req.userId })
            .populate('foods.food')
            .sort({ createdAt: -1 });
        
        console.log(`Found ${mealPlans.length} meal plans for user`);
        res.json(mealPlans);
    } catch (error) {
        console.error('Error fetching meal plans:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new meal plan
router.post('/plans', async (req, res) => {
    try {
        const { name, foods } = req.body;
        console.log('=== CREATE MEAL PLAN ROUTE CALLED ===');
        console.log('User ID:', req.userId);
        console.log('Meal plan data:', { name, foods });

        if (!name || !foods || !Array.isArray(foods) || foods.length === 0) {
            return res.status(400).json({ message: 'Name and foods array are required' });
        }

        // Calculate total calories and protein
        let totalCalories = 0;
        let totalProtein = 0;

        for (const item of foods) {
            if (!item.food) {
                return res.status(400).json({ message: 'Each food item must have a food ID' });
            }
            
            const food = await Food.findById(item.food);
            if (food) {
                const quantity = item.quantity || 1;
                totalCalories += food.calories * quantity;
                totalProtein += food.protein * quantity;
            } else {
                return res.status(400).json({ message: `Food with ID ${item.food} not found` });
            }
        }

        const mealPlan = new MealPlan({
            user: req.userId,
            name,
            foods,
            totalCalories,
            totalProtein
        });

        await mealPlan.save();
        await mealPlan.populate('foods.food');
        
        console.log('Meal plan created successfully:', mealPlan._id);
        res.status(201).json(mealPlan);
    } catch (error) {
        console.error('Error creating meal plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a meal plan
router.delete('/plans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('=== DELETE MEAL PLAN ROUTE CALLED ===');
        console.log('User ID:', req.userId);
        console.log('Meal plan ID:', id);

        const mealPlan = await MealPlan.findOneAndDelete({ _id: id, user: req.userId });
        
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        console.log('Meal plan deleted successfully:', id);
        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting meal plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
