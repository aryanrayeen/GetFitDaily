import mongoose from 'mongoose';
import Food from './src/models/Food.js';
import dotenv from 'dotenv';

dotenv.config();

const seedFoods = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing foods
        await Food.deleteMany({});
        console.log('Cleared existing foods');

        const foods = [
            // Proteins
            { name: 'Chicken Breast', category: 'proteins', calories: 165, protein: 31, serving: '100g' },
            { name: 'Salmon', category: 'proteins', calories: 208, protein: 22, serving: '100g' },
            { name: 'Eggs', category: 'proteins', calories: 155, protein: 13, serving: '100g' },
            { name: 'Greek Yogurt', category: 'proteins', calories: 59, protein: 10, serving: '100g' },
            { name: 'Tofu', category: 'proteins', calories: 76, protein: 8, serving: '100g' },
            
            // Carbs
            { name: 'Brown Rice', category: 'carbs', calories: 111, protein: 3, serving: '100g' },
            { name: 'Quinoa', category: 'carbs', calories: 120, protein: 4, serving: '100g' },
            { name: 'Oats', category: 'carbs', calories: 389, protein: 17, serving: '100g' },
            { name: 'Sweet Potato', category: 'carbs', calories: 86, protein: 2, serving: '100g' },
            { name: 'Whole Wheat Bread', category: 'carbs', calories: 247, protein: 13, serving: '100g' },
            
            // Vegetables
            { name: 'Broccoli', category: 'vegetables', calories: 34, protein: 3, serving: '100g' },
            { name: 'Spinach', category: 'vegetables', calories: 23, protein: 3, serving: '100g' },
            { name: 'Carrots', category: 'vegetables', calories: 41, protein: 1, serving: '100g' },
            { name: 'Bell Peppers', category: 'vegetables', calories: 31, protein: 1, serving: '100g' },
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

        const insertedFoods = await Food.insertMany(foods);
        console.log(`Inserted ${insertedFoods.length} foods successfully`);

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding foods:', error);
        process.exit(1);
    }
};

seedFoods();
