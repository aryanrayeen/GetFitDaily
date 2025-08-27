import mongoose from "mongoose";

const habitEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['water', 'steps', 'miles', 'prayers', 'sleep', 'meditation', 'reading', 'exercise'],
    default: 'water'
  },
  unit: {
    type: String,
    required: true,
    default: 'glasses'
  },
  goal: {
    type: Number,
    required: true,
    min: 1,
    default: 8
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  entries: [habitEntrySchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

// Index for better performance
habitSchema.index({ user: 1, type: 1 });
habitSchema.index({ 'entries.date': 1 });

export default mongoose.model("Habit", habitSchema);
