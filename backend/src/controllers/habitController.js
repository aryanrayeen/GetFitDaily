import Habit from "../models/Habit.js";

// Get all habits for user
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create new habit
export const createHabit = async (req, res) => {
  try {
    // Only use valid fields from req.body
    const { name, type, unit, goal, color } = req.body;
    console.log('Received habit creation request:', req.body);

    // Validate required fields
    if (!name || !type || !unit || !goal) {
      return res.status(400).json({ 
        error: "Missing required fields: name, type, unit, and goal are required" 
      });
    }

    // Check if habit type already exists for this user
    const existingHabit = await Habit.findOne({ user: req.userId, type });
    if (existingHabit) {
      return res.status(400).json({ error: "Habit type already exists" });
    }

    // Only use valid fields for new habit
    const newHabit = new Habit({
      name,
      type,
      unit,
      goal: Number(goal),
      color: color || '#3B82F6',
      user: req.userId,
      entries: []
    });

    try {
      const savedHabit = await newHabit.save();
      console.log('Successfully saved habit:', savedHabit);
      res.status(201).json(savedHabit);
    } catch (err) {
      console.error('Mongoose validation error:', err);
      res.status(400).json({ error: err.message });
    }
  } catch (error) {
    console.error("Error creating habit:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// Update habit settings
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, goal, color, unit } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: id, user: req.userId },
      { name, goal, color, unit },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.status(200).json(habit);
  } catch (error) {
    console.error("Error updating habit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findOneAndDelete({ _id: id, user: req.userId });
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update habit progress for a specific date
export const updateHabitProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, value } = req.body;

    const habit = await Habit.findOne({ _id: id, user: req.userId });
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Find existing entry for this date
    const existingEntryIndex = habit.entries.findIndex(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });

    const completed = value >= habit.goal;

    if (existingEntryIndex >= 0) {
      // Update existing entry
      habit.entries[existingEntryIndex].value = value;
      habit.entries[existingEntryIndex].completed = completed;
    } else {
      // Create new entry
      habit.entries.push({
        date: targetDate,
        value,
        completed
      });
    }

    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    console.error("Error updating habit progress:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get habit progress for date range
export const getHabitProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const habit = await Habit.findOne({ _id: id, user: req.userId });
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    let filteredEntries = habit.entries;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredEntries = habit.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    }

    res.status(200).json({
      habit: {
        _id: habit._id,
        name: habit.name,
        type: habit.type,
        unit: habit.unit,
        goal: habit.goal,
        color: habit.color
      },
      entries: filteredEntries
    });
  } catch (error) {
    console.error("Error fetching habit progress:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get leaderboard - users ranked by completed habits
export const getLeaderboard = async (req, res) => {
  try {
    // Aggregate habits and calculate completed goals for each user
    const leaderboard = await Habit.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          userId: '$user',
          userName: '$userInfo.name',
          completedCount: {
            $size: {
              $filter: {
                input: '$entries',
                cond: { $eq: ['$$this.completed', true] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$userId',
          name: { $first: '$userName' },
          totalCompleted: { $sum: '$completedCount' }
        }
      },
      {
        $sort: { totalCompleted: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: 1,
          completedGoals: '$totalCompleted'
        }
      }
    ]);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.status(200).json(rankedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
};
