import express from "express";
import { 
  getHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  updateHabitProgress, 
  getHabitProgress,
  getLeaderboard
} from "../controllers/habitController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// All habit routes require authentication
router.use(verifyToken);

// Get all habits for user
router.get("/", getHabits);

// Get leaderboard (must come before /:id routes)
router.get("/leaderboard", getLeaderboard);

// Create new habit
router.post("/", createHabit);

// Update habit settings
router.put("/:id", updateHabit);

// Delete habit
router.delete("/:id", deleteHabit);

// Update habit progress for specific date
router.post("/:id/progress", updateHabitProgress);

// Get habit progress for date range
router.get("/:id/progress", getHabitProgress);

export default router;
