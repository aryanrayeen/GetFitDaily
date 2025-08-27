import express from "express";
import { createWorkout, deleteWorkout, getALLWorkouts, getWorkoutById, updateWorkout } from "../controllers/workoutController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// All workout routes require authentication
router.use(verifyToken);

router.get("/", getALLWorkouts);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;