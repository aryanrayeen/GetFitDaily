import Food from '../models/Food.js';
import MealPlan from '../models/MealPlan.js';

// Get all foods by category
export const getFoodsByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const foods = await Food.find(query).sort({ name: 1 });
        res.json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all food categories
export const getFoodCategories = async (req, res) => {
    try {
        const categories = await Food.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new meal plan
export const createMealPlan = async (req, res) => {
    try {
    const { name, foods } = req.body;
    // const userId = req.user?.id;

        // Calculate total calories and protein
        let totalCalories = 0;
        let totalProtein = 0;

        for (const item of foods) {
            const food = await Food.findById(item.food);
            if (food) {
                totalCalories += food.calories * (item.quantity || 1);
                totalProtein += food.protein * (item.quantity || 1);
            }
        }

        const mealPlan = new MealPlan({
            // user: userId,
            name,
            foods,
            totalCalories,
            totalProtein
        });

        await mealPlan.save();
        await mealPlan.populate('foods.food');
        
        res.status(201).json(mealPlan);
    } catch (error) {
        console.error('Error creating meal plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's meal plans
export const getMealPlans = async (req, res) => {
    try {
        // const userId = req.user?.id;
        const mealPlans = await MealPlan.find({})
            .populate('foods.food')
            .sort({ createdAt: -1 });
        res.json(mealPlans);
    } catch (error) {
        console.error('Error fetching meal plans:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a meal plan
export const deleteMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        // const userId = req.user?.id;

        const mealPlan = await MealPlan.findOneAndDelete({ _id: id });
        
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting meal plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Seed foods data (for development)
export const seedFoods = async (req, res) => {
    try {
        const foods = [
            // Proteins
            { name: 'Chicken Breast', category: 'proteins', calories: 165, protein: 31, serving: '100g' },
            { name: 'Salmon', category: 'proteins', calories: 208, protein: 25, serving: '100g' },
            { name: 'Eggs', category: 'proteins', calories: 155, protein: 13, serving: '100g' },
            { name: 'Tuna', category: 'proteins', calories: 132, protein: 28, serving: '100g' },
            
            // Carbs
            { name: 'Brown Rice', category: 'carbs', calories: 111, protein: 3, serving: '100g' },
            { name: 'Oats', category: 'carbs', calories: 68, protein: 2, serving: '100g' },
            { name: 'Sweet Potato', category: 'carbs', calories: 86, protein: 2, serving: '100g' },
            { name: 'Whole Wheat Bread', category: 'carbs', calories: 247, protein: 13, serving: '100g' },
            
            // Vegetables
            { name: 'Broccoli', category: 'vegetables', calories: 34, protein: 3, serving: '100g' },
            { name: 'Spinach', category: 'vegetables', calories: 23, protein: 3, serving: '100g' },
            { name: 'Capsicum', category: 'vegetables', calories: 31, protein: 1, serving: '100g' },
            { name: 'Carrots', category: 'vegetables', calories: 41, protein: 1, serving: '100g' },
            { name: 'Tomatoes', category: 'vegetables', calories: 18, protein: 1, serving: '100g' },
            
            // Fruits
            { name: 'Banana', category: 'fruits', calories: 89, protein: 1, serving: '100g' },
            { name: 'Apple', category: 'fruits', calories: 52, protein: 0, serving: '100g' },
            { name: 'Berries', category: 'fruits', calories: 57, protein: 1, serving: '100g' },
            { name: 'Orange', category: 'fruits', calories: 47, protein: 1, serving: '100g' },
            { name: 'Avocado', category: 'fruits', calories: 160, protein: 2, serving: '100g' },
            
            // Dairy
            { name: 'Milk', category: 'dairy', calories: 42, protein: 3, serving: '100ml' },
            { name: 'Cheese', category: 'dairy', calories: 113, protein: 7, serving: '100g' },
            { name: 'Cottage Cheese', category: 'dairy', calories: 98, protein: 11, serving: '100g' },
            
            // Snacks
            { name: 'Almonds', category: 'snacks', calories: 579, protein: 21, serving: '100g' },
            { name: 'Peanut Butter', category: 'snacks', calories: 588, protein: 25, serving: '100g' },
            { name: 'Protein Bar', category: 'snacks', calories: 400, protein: 20, serving: '100g' }
        ];

        await Food.deleteMany({});
        await Food.insertMany(foods);
        
        res.json({ message: 'Foods seeded successfully', count: foods.length });
    } catch (error) {
        console.error('Error seeding foods:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
