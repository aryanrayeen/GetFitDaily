import mongoose from "mongoose";

// 1. create a schema
// 2. model based off of that schema

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Workout = mongoose.model("Workout", workoutSchema)

export default Workout