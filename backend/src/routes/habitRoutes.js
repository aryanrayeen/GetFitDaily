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
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/progress", updateHabitProgress);
router.get("/:id/progress", getHabitProgress);

export default router;
