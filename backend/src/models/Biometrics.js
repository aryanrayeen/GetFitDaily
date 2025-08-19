import mongoose from 'mongoose';

const biometricsSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    caloriesIntake: {
        type: Number,
        required: true
    },
    exerciseMinutes: {
        type: Number,
        required: true
    },
    waistMeasurement: {
        type: Number,
        default: null
    },
    bodyFatPercentage: {
        type: Number,
        default: null
    },
    goalWeight: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Biometrics = mongoose.model('Biometrics', biometricsSchema);

export default Biometrics;
