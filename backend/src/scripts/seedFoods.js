import mongoose from 'mongoose';
import Food from '../models/Food.js';
import dotenv from 'dotenv';

dotenv.config();

const foods = [
    // Proteins
    {
        name: "Chicken Breast",
        category: "proteins",
        calories: 165,
        protein: 31,
        serving: "100g"
    },
    {
        name: "Salmon",
        category: "proteins",
        calories: 208,
        protein: 22,
        serving: "100g"
    },
    {
        name: "Eggs",
        category: "proteins",
        calories: 155,
        protein: 13,
        serving: "100g"
    },
    {
        name: "Greek Yogurt",
        category: "proteins",
        calories: 59,
        protein: 10,
        serving: "100g"
    },
    {
        name: "Tofu",
        category: "proteins",
        calories: 76,
        protein: 8,
        serving: "100g"
    },

    // Carbs
    {
        name: "Brown Rice",
        category: "carbs",
        calories: 111,
        protein: 2.6,
        serving: "100g"
    },
    {
        name: "Quinoa",
        category: "carbs",
        calories: 120,
        protein: 4.4,
        serving: "100g"
    },
    {
        name: "Oats",
        category: "carbs",
        calories: 389,
        protein: 17,
        serving: "100g"
    },
    {
        name: "Sweet Potato",
        category: "carbs",
        calories: 86,
        protein: 1.6,
        serving: "100g"
    },
    {
        name: "Whole Wheat Bread",
        category: "carbs",
        calories: 247,
        protein: 13,
        serving: "100g"
    },

    // Vegetables
    {
        name: "Broccoli",
        category: "vegetables",
        calories: 34,
        protein: 2.8,
        serving: "100g"
    },
    {
        name: "Spinach",
        category: "vegetables",
        calories: 23,
        protein: 2.9,
        serving: "100g"
    },
    {
        name: "Bell Pepper",
        category: "vegetables",
        calories: 31,
        protein: 1,
        serving: "100g"
    },
    {
        name: "Carrots",
        category: "vegetables",
        calories: 41,
        protein: 0.9,
        serving: "100g"
    },
    {
        name: "Kale",
        category: "vegetables",
        calories: 49,
        protein: 4.3,
        serving: "100g"
    },

    // Fruits
    {
        name: "Apple",
        category: "fruits",
        calories: 52,
        protein: 0.3,
        serving: "100g"
    },
    {
        name: "Banana",
        category: "fruits",
        calories: 89,
        protein: 1.1,
        serving: "100g"
    },
    {
        name: "Blueberries",
        category: "fruits",
        calories: 57,
        protein: 0.7,
        serving: "100g"
    },
    {
        name: "Orange",
        category: "fruits",
        calories: 47,
        protein: 0.9,
        serving: "100g"
    },
    {
        name: "Avocado",
        category: "fruits",
        calories: 160,
        protein: 2,
        serving: "100g"
    },

    // Dairy
    {
        name: "Milk",
        category: "dairy",
        calories: 42,
        protein: 3.4,
        serving: "100ml"
    },
    {
        name: "Cheese",
        category: "dairy",
        calories: 113,
        protein: 25,
        serving: "100g"
    },
    {
        name: "Cottage Cheese",
        category: "dairy",
        calories: 98,
        protein: 11,
        serving: "100g"
    },

    // Snacks
    {
        name: "Almonds",
        category: "snacks",
        calories: 579,
        protein: 21,
        serving: "100g"
    },
    {
        name: "Walnuts",
        category: "snacks",
        calories: 654,
        protein: 15,
        serving: "100g"
    },
    {
        name: "Dark Chocolate",
        category: "snacks",
        calories: 546,
        protein: 7.8,
        serving: "100g"
    },

    // Beverages
    {
        name: "Water",
        category: "beverages",
        calories: 0,
        protein: 0,
        serving: "100ml"
    },
    {
        name: "Green Tea",
        category: "beverages",
        calories: 1,
        protein: 0,
        serving: "100ml"
    },
    {
        name: "Orange Juice",
        category: "beverages",
        calories: 45,
        protein: 0.7,
        serving: "100ml"
    }
];

async function seedFoods() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing foods
        await Food.deleteMany({});
        console.log('Cleared existing foods');

        // Insert new foods
        const savedFoods = await Food.insertMany(foods);
        console.log(`Inserted ${savedFoods.length} foods`);

        console.log('Food seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding foods:', error);
        process.exit(1);
    }
}

seedFoods();
