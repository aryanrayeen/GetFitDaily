import { Settings, Target, Flame } from 'lucide-react';

const HabitCard = ({ habit, progress, onProgressUpdate, onSettings, habitTypes, streak = 0 }) => {
  const completed = progress >= habit.goal;
  const progressPercentage = Math.min((progress / habit.goal) * 100, 100);
  const HabitIcon = habitTypes.find(ht => ht.value === habit.type)?.icon || Target;

  return (
    <div className="card bg-base-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: habit.color }}
          >
            <HabitIcon size={20} />
          </div>
          <div>
            <h3 className="font-semibold">{habit.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-base-content/70">
                Goal: {habit.goal} {habit.unit}
              </p>
              {streak > 0 && (
                <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  <Flame size={12} />
                  <span>{streak} day streak</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onSettings(habit)}
          className="btn btn-ghost btn-sm hover:bg-base-200"
        >
          <Settings size={16} />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-semibold">
            {progress} / {habit.goal} {habit.unit}
          </span>
        </div>
        <div className="w-full bg-base-300 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: habit.color
            }}
          />
        </div>
        {progressPercentage > 0 && (
          <div className="text-xs text-base-content/60 mt-1">
            {Math.round(progressPercentage)}% complete
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={progress}
          onChange={(e) => onProgressUpdate(habit._id, e.target.value)}
          className="input input-bordered input-sm flex-1"
          placeholder={`Enter ${habit.unit}...`}
        />
        <span className="text-sm text-base-content/70 min-w-fit">{habit.unit}</span>
        {completed && (
          <div className="badge badge-success gap-1">
            <span className="text-xs">✓</span>
            Done!
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
