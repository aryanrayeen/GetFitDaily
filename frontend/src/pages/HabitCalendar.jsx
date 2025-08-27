import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HabitCard from '../components/HabitCard';
import HabitQuickSetup from '../components/HabitQuickSetup';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Calendar, Plus, Target, Droplets, Footprints, Clock, Heart, Book, Dumbbell, Brain, MapPin } from 'lucide-react';

const HabitCalendar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    type: 'water',
    unit: 'glasses',
    goal: 8,
    color: '#3B82F6'
  });

  const habitTypes = [
    { value: 'water', label: 'Water Intake', icon: Droplets, unit: 'glasses', defaultGoal: 8 },
    { value: 'steps', label: 'Steps', icon: Footprints, unit: 'steps', defaultGoal: 10000 },
    { value: 'miles', label: 'Miles', icon: MapPin, unit: 'miles', defaultGoal: 3 },
    { value: 'prayers', label: 'Prayers', icon: Heart, unit: 'times', defaultGoal: 5 },
    { value: 'sleep', label: 'Sleep', icon: Clock, unit: 'hours', defaultGoal: 8 },
    { value: 'meditation', label: 'Meditation', icon: Brain, unit: 'minutes', defaultGoal: 20 },
    { value: 'reading', label: 'Reading', icon: Book, unit: 'pages', defaultGoal: 10 },
    { value: 'exercise', label: 'Exercise', icon: Dumbbell, unit: 'minutes', defaultGoal: 30 }
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  useEffect(() => {
    fetchHabits();
    
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowSettingsModal(false);
        setShowQuickSetup(false);
      }
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowAddModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async () => {
    try {
      const response = await api.post('/habits', newHabit);
      setHabits([...habits, response.data]);
      setShowAddModal(false);
      setNewHabit({ name: '', type: 'water', unit: 'glasses', goal: 8, color: '#3B82F6' });
      toast.success('Habit created successfully!');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error(error.response?.data?.error || 'Failed to create habit');
    }
  };

  const updateHabit = async () => {
    try {
      const response = await api.put(`/habits/${editingHabit._id}`, editingHabit);
      setHabits(habits.map(h => h._id === editingHabit._id ? response.data : h));
      setShowSettingsModal(false);
      setEditingHabit(null);
      toast.success('Habit updated successfully!');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const deleteHabit = async (habitId) => {
    if (!confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter(h => h._id !== habitId));
      setShowSettingsModal(false);
      setEditingHabit(null);
      toast.success('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const updateProgress = async (habitId, value) => {
    if (updating) return; // Prevent multiple simultaneous updates
    
    setUpdating(true);
    try {
      const response = await api.post(`/habits/${habitId}/progress`, {
        date: selectedDate.toISOString(),
        value: parseInt(value) || 0
      });
      
      const updatedHabit = response.data;
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
      
      // Check if habit was just completed
      const habitBefore = habits.find(h => h._id === habitId);
      const progressBefore = getTodayProgress(habitBefore);
      const wasCompleted = progressBefore >= habitBefore.goal;
      const isNowCompleted = parseInt(value) >= habitBefore.goal;
      
      if (!wasCompleted && isNowCompleted) {
        toast.success(`🎉 Congrats! You completed "${habitBefore.name}" today!`, {
          duration: 4000,
        });
      } else {
        toast.success('Progress updated!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setUpdating(false);
    }
  };

  const getTodayProgress = (habit) => {
    const today = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);
    
    const entry = habit.entries.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    return entry ? entry.value : 0;
  };

  const isHabitCompleted = (habit) => {
    const progress = getTodayProgress(habit);
    return progress >= habit.goal;
  };

  const getCompletedDaysInMonth = (habit) => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    return habit.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && 
             entryDate.getFullYear() === currentYear && 
             entry.completed;
    }).map(entry => new Date(entry.date).getDate());
  };

  const getHabitStreak = (habit) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    // Check backwards from today
    while (currentDate >= new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000))) { // Max 1 year back
      const entry = habit.entries.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === currentDate.getTime();
      });
      
      if (entry && entry.completed) {
        streak++;
      } else {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getMotivationalMessage = () => {
    if (habits.length === 0) return "Start your journey to better habits today!";
    
    const completedToday = habits.filter(h => isHabitCompleted(h)).length;
    const totalHabits = habits.length;
    const percentage = (completedToday / totalHabits) * 100;
    
    if (percentage === 100) return "🎉 Amazing! You've completed all your habits today!";
    if (percentage >= 75) return "🔥 You're on fire! Keep up the great work!";
    if (percentage >= 50) return "💪 Great progress! You're halfway there!";
    if (percentage >= 25) return "🌱 Good start! Every step counts!";
    return "🚀 Ready to build some healthy habits?";
  };

  const handleTypeChange = (type) => {
    const habitType = habitTypes.find(ht => ht.value === type);
    setNewHabit(prev => ({
      ...prev,
      type,
      unit: habitType.unit,
      goal: habitType.defaultGoal,
      name: habitType.label
    }));
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const calendarDays = [];
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      const completedHabits = habits.filter(habit => {
        const completedDays = getCompletedDaysInMonth(habit);
        return completedDays.includes(day);
      }).length;
      
      const totalHabits = habits.length;
      const completionRate = totalHabits > 0 ? completedHabits / totalHabits : 0;
      
      calendarDays.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded cursor-pointer transition-colors
            ${isToday ? 'bg-primary text-primary-content font-bold' : 'hover:bg-base-300'}
            ${completionRate === 1 && totalHabits > 0 ? 'bg-success text-success-content' : ''}
            ${completionRate > 0 && completionRate < 1 ? 'bg-warning text-warning-content' : ''}
          `}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          {day}
        </div>
      );
    }
    
    return calendarDays;
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar onMenuClick={toggleSidebar} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Loading habits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="max-w-7xl mx-auto p-4 mt-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Habit Calendar</h1>
          </div>
          <div className="flex gap-2">
            {habits.length > 0 && (
              <button
                onClick={() => setShowQuickSetup(true)}
                className="btn btn-outline gap-2"
              >
                Quick Add
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary gap-2"
              title="Keyboard shortcut: Ctrl+N"
            >
              <Plus size={20} />
              Add Habit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Habits List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            {habits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-base-100 rounded-lg p-4">
                  <div className="stat-title text-sm">Total Habits</div>
                  <div className="stat-value text-2xl">{habits.length}</div>
                </div>
                <div className="stat bg-base-100 rounded-lg p-4">
                  <div className="stat-title text-sm">Completed Today</div>
                  <div className="stat-value text-2xl text-success">
                    {habits.filter(h => isHabitCompleted(h)).length}
                  </div>
                </div>
                <div className="stat bg-base-100 rounded-lg p-4">
                  <div className="stat-title text-sm">Success Rate</div>
                  <div className="stat-value text-2xl text-primary">
                    {habits.length > 0 ? Math.round((habits.filter(h => isHabitCompleted(h)).length / habits.length) * 100) : 0}%
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold">Today's Progress</h2>
              <p className="text-base-content/70">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="mt-2 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-primary">{getMotivationalMessage()}</p>
              </div>
            </div>
            
            {habits.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <Target className="w-16 h-16 mx-auto text-base-content/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
                <p className="text-base-content/70 mb-4">
                  Start building healthy habits by creating your first one!
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setShowQuickSetup(true)}
                    className="btn btn-primary"
                  >
                    Quick Setup
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-outline"
                  >
                    Create Custom
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => {
                  const progress = getTodayProgress(habit);
                  const streak = getHabitStreak(habit);
                  
                  return (
                    <HabitCard
                      key={habit._id}
                      habit={habit}
                      progress={progress}
                      streak={streak}
                      onProgressUpdate={updateProgress}
                      onSettings={(habit) => {
                        setEditingHabit(habit);
                        setShowSettingsModal(true);
                      }}
                      habitTypes={habitTypes}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Calendar View</h2>
            <div className="card bg-base-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                  className="btn btn-ghost btn-sm"
                >
                  ‹
                </button>
                <div className="text-center">
                  <h3 className="font-semibold">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="btn btn-ghost btn-xs mt-1"
                  >
                    Today
                  </button>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                  className="btn btn-ghost btn-sm"
                >
                  ›
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-base-content/70 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
              
              <div className="mt-4 text-sm text-base-content/70">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span>All habits completed</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-warning rounded"></div>
                  <span>Some habits completed</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-base-300 rounded"></div>
                  <span>No progress</span>
                </div>
              </div>

              {/* Monthly Stats */}
              {habits.length > 0 && (
                <div className="mt-6 p-4 bg-base-200 rounded-lg">
                  <h4 className="font-semibold mb-2">This Month</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Days with all habits:</span>
                      <span className="font-medium text-success">
                        {(() => {
                          const currentMonth = selectedDate.getMonth();
                          const currentYear = selectedDate.getFullYear();
                          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                          let completeDays = 0;
                          
                          for (let day = 1; day <= daysInMonth; day++) {
                            const completedHabits = habits.filter(habit => {
                              const completedDays = getCompletedDaysInMonth(habit);
                              return completedDays.includes(day);
                            }).length;
                            
                            if (completedHabits === habits.length && habits.length > 0) {
                              completeDays++;
                            }
                          }
                          
                          return completeDays;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best habit:</span>
                      <span className="font-medium">
                        {(() => {
                          if (habits.length === 0) return 'None';
                          
                          const habitStats = habits.map(habit => ({
                            name: habit.name,
                            completed: getCompletedDaysInMonth(habit).length
                          }));
                          
                          const best = habitStats.reduce((prev, current) => 
                            prev.completed > current.completed ? prev : current
                          );
                          
                          return `${best.name} (${best.completed} days)`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Habit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Habit Type</span>
                </label>
                <select
                  value={newHabit.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {habitTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Habit Name</span>
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="input input-bordered w-full"
                  placeholder="Enter habit name..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Goal</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newHabit.goal}
                    onChange={(e) => setNewHabit({...newHabit, goal: parseInt(e.target.value)})}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Unit</span>
                  </label>
                  <input
                    type="text"
                    value={newHabit.unit}
                    onChange={(e) => setNewHabit({...newHabit, unit: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Color</span>
                </label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({...newHabit, color})}
                      className={`w-8 h-8 rounded-full border-2 ${newHabit.color === color ? 'border-base-content' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-action">
              <button onClick={() => setShowAddModal(false)} className="btn">
                Cancel
              </button>
              <button onClick={createHabit} className="btn btn-primary">
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && editingHabit && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Habit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Habit Name</span>
                </label>
                <input
                  type="text"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({...editingHabit, name: e.target.value})}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Goal</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingHabit.goal}
                    onChange={(e) => setEditingHabit({...editingHabit, goal: parseInt(e.target.value)})}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Unit</span>
                  </label>
                  <input
                    type="text"
                    value={editingHabit.unit}
                    onChange={(e) => setEditingHabit({...editingHabit, unit: e.target.value})}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Color</span>
                </label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setEditingHabit({...editingHabit, color})}
                      className={`w-8 h-8 rounded-full border-2 ${editingHabit.color === color ? 'border-base-content' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                onClick={() => deleteHabit(editingHabit._id)}
                className="btn btn-error mr-auto"
              >
                Delete
              </button>
              <button onClick={() => setShowSettingsModal(false)} className="btn">
                Cancel
              </button>
              <button onClick={updateHabit} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Setup Modal */}
      {showQuickSetup && (
        <HabitQuickSetup
          onCreateHabit={async (habitData) => {
            console.log('HabitCalendar: Creating habit with data:', habitData);
            
            // Filter out description and any other unwanted fields
            const cleanHabitData = {
              name: habitData.name,
              type: habitData.type,
              unit: habitData.unit,
              goal: habitData.goal,
              color: habitData.color
            };
            
            console.log('HabitCalendar: Sending clean data:', cleanHabitData);
            
            try {
              const response = await api.post('/habits', cleanHabitData);
              console.log('HabitCalendar: API response:', response.data);
              setHabits(prev => [...prev, response.data]);
              return response.data; // Return success indicator
            } catch (error) {
              console.error('HabitCalendar: Error creating habit:', error);
              console.error('Error response:', error.response?.data);
              if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
              }
              throw new Error(`Failed to create habit: ${error.message}`);
            }
          }}
          onClose={() => setShowQuickSetup(false)}
        />
      )}
    </div>
  );
};

export default HabitCalendar;
