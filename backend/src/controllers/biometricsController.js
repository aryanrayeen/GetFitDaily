import Biometrics from '../models/Biometrics.js';

// Get the latest biometrics
export const getBiometrics = async (req, res) => {
    try {
        const biometrics = await Biometrics.findOne({ user: req.userId }).sort({ date: -1 });
        res.status(200).json(biometrics);
    } catch (error) {
        console.error('Error in getBiometrics:', error);
        res.status(500).json({ message: 'Failed to fetch biometrics' });
    }
};

// Get biometrics history
export const getBiometricsHistory = async (req, res) => {
    try {
        const { type, limit = 10 } = req.query;
        let biometrics;
        
        if (type === 'weight') {
            biometrics = await Biometrics.find({ user: req.userId }, 'weight date').sort({ date: -1 }).limit(parseInt(limit));
        } else if (type === 'waist') {
            biometrics = await Biometrics.find({ user: req.userId, waistMeasurement: { $ne: null } }, 'waistMeasurement date').sort({ date: -1 }).limit(parseInt(limit));
        } else if (type === 'bodyfat') {
            biometrics = await Biometrics.find({ user: req.userId, bodyFatPercentage: { $ne: null } }, 'bodyFatPercentage date').sort({ date: -1 }).limit(parseInt(limit));
        } else {
            biometrics = await Biometrics.find({ user: req.userId }).sort({ date: -1 }).limit(parseInt(limit));
        }
        
        res.status(200).json(biometrics);
    } catch (error) {
        console.error('Error in getBiometricsHistory:', error);
        res.status(500).json({ message: 'Failed to fetch biometrics history' });
    }
};

// Create or update biometrics
export const updateBiometrics = async (req, res) => {
    try {
        const { age, height, weight, caloriesIntake, exerciseMinutes, waistMeasurement, bodyFatPercentage, goalWeight, gender } = req.body;

        // Validate required fields
        if (!age || !height || !weight || !caloriesIntake || !exerciseMinutes) {
            return res.status(400).json({ message: 'Age, height, weight, calories intake, and exercise minutes are required' });
        }

        // Create new biometrics entry
        const biometrics = new Biometrics({
            age,
            height,
            weight,
            caloriesIntake,
            exerciseMinutes,
            waistMeasurement: waistMeasurement || null,
            bodyFatPercentage: bodyFatPercentage || null,
            goalWeight: goalWeight || null,
            gender: gender || 'male',
            user: req.userId
        });

        await biometrics.save();
        res.status(201).json(biometrics);
    } catch (error) {
        console.error('Error in updateBiometrics:', error);
        res.status(500).json({ message: 'Failed to update biometrics' });
    }
};

// Add weight entry
export const addWeightEntry = async (req, res) => {
    try {
        const { weight } = req.body;
        
        if (!weight) {
            return res.status(400).json({ message: 'Weight is required' });
        }

        // Get latest biometrics to copy other values
        const latestBiometrics = await Biometrics.findOne({ user: req.userId }).sort({ date: -1 });
        
        if (!latestBiometrics) {
            return res.status(400).json({ message: 'No existing biometrics found. Please complete your profile first.' });
        }

        // Create new entry with updated weight
        const newEntry = new Biometrics({
            age: latestBiometrics.age,
            height: latestBiometrics.height,
            weight: parseFloat(weight),
            caloriesIntake: latestBiometrics.caloriesIntake,
            exerciseMinutes: latestBiometrics.exerciseMinutes,
            waistMeasurement: latestBiometrics.waistMeasurement,
            bodyFatPercentage: latestBiometrics.bodyFatPercentage,
            goalWeight: latestBiometrics.goalWeight,
            gender: latestBiometrics.gender,
            user: req.userId
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error in addWeightEntry:', error);
        res.status(500).json({ message: 'Failed to add weight entry' });
    }
};

// Add waist measurement entry
export const addWaistEntry = async (req, res) => {
    try {
        const { waistMeasurement } = req.body;
        
        if (!waistMeasurement) {
            return res.status(400).json({ message: 'Waist measurement is required' });
        }

        // Get latest biometrics to copy other values
        const latestBiometrics = await Biometrics.findOne({ user: req.userId }).sort({ date: -1 });
        
        if (!latestBiometrics) {
            return res.status(400).json({ message: 'No existing biometrics found. Please complete your profile first.' });
        }

        // Create new entry with updated waist measurement
        const newEntry = new Biometrics({
            age: latestBiometrics.age,
            height: latestBiometrics.height,
            weight: latestBiometrics.weight,
            caloriesIntake: latestBiometrics.caloriesIntake,
            exerciseMinutes: latestBiometrics.exerciseMinutes,
            waistMeasurement: parseFloat(waistMeasurement),
            bodyFatPercentage: latestBiometrics.bodyFatPercentage,
            goalWeight: latestBiometrics.goalWeight,
            gender: latestBiometrics.gender,
            user: req.userId
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error in addWaistEntry:', error);
        res.status(500).json({ message: 'Failed to add waist measurement entry' });
    }
};

// Add body fat percentage entry
export const addBodyFatEntry = async (req, res) => {
    try {
        const { bodyFatPercentage } = req.body;
        
        if (!bodyFatPercentage) {
            return res.status(400).json({ message: 'Body fat percentage is required' });
        }

        // Get latest biometrics to copy other values
        const latestBiometrics = await Biometrics.findOne({ user: req.userId }).sort({ date: -1 });
        
        if (!latestBiometrics) {
            return res.status(400).json({ message: 'No existing biometrics found. Please complete your profile first.' });
        }

        // Create new entry with updated body fat percentage
        const newEntry = new Biometrics({
            age: latestBiometrics.age,
            height: latestBiometrics.height,
            weight: latestBiometrics.weight,
            caloriesIntake: latestBiometrics.caloriesIntake,
            exerciseMinutes: latestBiometrics.exerciseMinutes,
            waistMeasurement: latestBiometrics.waistMeasurement,
            bodyFatPercentage: parseFloat(bodyFatPercentage),
            goalWeight: latestBiometrics.goalWeight,
            gender: latestBiometrics.gender,
            user: req.userId
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error in addBodyFatEntry:', error);
        res.status(500).json({ message: 'Failed to add body fat entry' });
    }
};
