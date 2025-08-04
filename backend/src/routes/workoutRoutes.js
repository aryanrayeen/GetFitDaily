import express from "express";
import { createWorkout, deleteWorkout, getALLWorkouts, getWorkoutById, updateWorkout } from "../controllers/workoutController.js";


const router = express.Router();

router.get("/", getALLWorkouts);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;