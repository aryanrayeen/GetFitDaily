// Default habits that users can quickly add
export const defaultHabits = [
  {
    name: 'Drink Water',
    type: 'water',
    unit: 'glasses',
    goal: 8,
    color: '#06B6D4',
    description: 'Stay hydrated throughout the day'
  },
  {
    name: 'Daily Steps',
    type: 'steps',
    unit: 'steps',
    goal: 10000,
    color: '#10B981',
    description: 'Walk 10,000 steps daily for better health'
  },
  {
    name: 'Running/Walking Miles',
    type: 'miles',
    unit: 'miles',
    goal: 3,
    color: '#F59E0B',
    description: 'Cover distance through running or walking'
  },
  {
    name: 'Daily Prayers',
    type: 'prayers',
    unit: 'times',
    goal: 5,
    color: '#8B5CF6',
    description: 'Maintain spiritual practice'
  },
  {
    name: 'Sleep Hours',
    type: 'sleep',
    unit: 'hours',
    goal: 8,
    color: '#6366F1',
    description: 'Get adequate rest for recovery'
  },
  {
    name: 'Meditation',
    type: 'meditation',
    unit: 'minutes',
    goal: 20,
    color: '#EF4444',
    description: 'Practice mindfulness and meditation'
  },
  {
    name: 'Reading',
    type: 'reading',
    unit: 'pages',
    goal: 10,
    color: '#F97316',
    description: 'Read books for knowledge and relaxation'
  },
  {
    name: 'Exercise',
    type: 'exercise',
    unit: 'minutes',
    goal: 30,
    color: '#84CC16',
    description: 'Daily physical exercise routine'
  }
];

// Helper function to get habit type info
export const getHabitTypeInfo = (type) => {
  return defaultHabits.find(habit => habit.type === type);
};
