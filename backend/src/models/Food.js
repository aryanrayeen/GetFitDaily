import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['proteins', 'carbs', 'vegetables', 'fruits', 'dairy', 'snacks', 'beverages']
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    serving: {
        type: String,
        default: '100g'
    }
}, {
    timestamps: true
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
