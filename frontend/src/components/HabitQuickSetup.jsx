import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { defaultHabits } from '../lib/habitDefaults';
import toast from 'react-hot-toast';

const HabitQuickSetup = ({ onCreateHabit, onClose }) => {
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleHabit = (habit) => {
    console.log('Toggling habit:', habit);
    setSelectedHabits(prev => {
      const isSelected = prev.some(h => h.type === habit.type);
      if (isSelected) {
        const newSelected = prev.filter(h => h.type !== habit.type);
        console.log('Removed habit, new selection:', newSelected);
        return newSelected;
      } else {
        const newSelected = [...prev, habit];
        console.log('Added habit, new selection:', newSelected);
        return newSelected;
      }
    });
  };

  const createSelectedHabits = async () => {
    console.log('Creating habits button clicked!', selectedHabits);
    
    if (selectedHabits.length === 0) {
      toast.error('Please select at least one habit to create');
      return;
    }
    
    setLoading(true);
    let successCount = 0;
    
    try {
      for (const habit of selectedHabits) {
        // Only send valid fields
        const cleanHabit = {
          name: habit.name,
          type: habit.type,
          unit: habit.unit,
          goal: habit.goal,
          color: habit.color
        };
        try {
          console.log('Creating habit:', cleanHabit);
          const result = await onCreateHabit(cleanHabit);
          console.log('API call result:', result);
          successCount++;
          console.log(`Successfully created: ${cleanHabit.name}`);
        } catch (error) {
          console.error(`Failed to create habit: ${cleanHabit.name}`, error);
          toast.error(`Failed to create ${cleanHabit.name}: ${error.message}`);
        }
      }
      
      console.log(`Created ${successCount} out of ${selectedHabits.length} habits`);
      
      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} habit${successCount !== 1 ? 's' : ''}!`);
      }
      
      if (successCount === selectedHabits.length) {
        console.log('All habits created successfully, closing modal');
        onClose();
      }
    } catch (error) {
      console.error('Error in batch habit creation:', error);
      toast.error('Something went wrong while creating habits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-xl mb-4">Quick Setup - Choose Your Habits</h3>
        <p className="text-base-content/70 mb-6">
          Select the habits you'd like to track. You can customize them later.
          {selectedHabits.length > 0 && (
            <span className="block mt-2 text-primary font-medium">
              {selectedHabits.length} habit{selectedHabits.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {defaultHabits.map((habit) => {
            const isSelected = selectedHabits.some(h => h.type === habit.type);
            
            return (
              <div
                key={habit.type}
                onClick={() => toggleHabit(habit)}
                className={`card cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary text-primary-content border-2 border-primary' 
                    : 'bg-base-100 hover:bg-base-200 border-2 border-transparent'
                }`}
              >
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: habit.color }}
                      >
                        {habit.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{habit.name}</h4>
                        <p className="text-sm opacity-70">
                          Goal: {habit.goal} {habit.unit}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={20} className="text-success" />
                    )}
                  </div>
                  <p className="text-xs opacity-60 mt-2">{habit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Skip for now
          </button>
          <button 
            onClick={createSelectedHabits}
            disabled={selectedHabits.length === 0 || loading}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Create {selectedHabits.length} Habit{selectedHabits.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitQuickSetup;
