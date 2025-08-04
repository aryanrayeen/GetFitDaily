import Biometrics from '../models/Biometrics.js';

// Get the latest biometrics
export const getBiometrics = async (req, res) => {
    try {
        const biometrics = await Biometrics.findOne().sort({ date: -1 });
        res.status(200).json(biometrics);
    } catch (error) {
        console.error('Error in getBiometrics:', error);
        res.status(500).json({ message: 'Failed to fetch biometrics' });
    }
};

// Create or update biometrics
export const updateBiometrics = async (req, res) => {
    try {
        const { age, height, weight, caloriesIntake, exerciseMinutes } = req.body;

        // Validate required fields
        if (!age || !height || !weight || !caloriesIntake || !exerciseMinutes) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new biometrics entry
        const biometrics = new Biometrics({
            age,
            height,
            weight,
            caloriesIntake,
            exerciseMinutes
        });

        await biometrics.save();
        res.status(201).json(biometrics);
    } catch (error) {
        console.error('Error in updateBiometrics:', error);
        res.status(500).json({ message: 'Failed to update biometrics' });
    }
};
