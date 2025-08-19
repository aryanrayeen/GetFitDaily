import { Routes, Route } from 'react-router-dom';

import Dashboard  from './pages/Dashboard';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutPlan from './pages/WorkoutPlan';
import Tutorials from './pages/Tutorials';
import ZenSection from './pages/ZenSection';
import ProgressTracker from './pages/ProgressTracker';
import MealPlanner from './pages/MealPlanner';


const App = () => {
  return (
    <div data-theme="night">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/createworkout" element={<CreateWorkout />} />
        <Route path="/workoutplan/:id" element={<WorkoutPlan />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/zen-section" element={<ZenSection />} />
        <Route path="/progress-tracker" element={<ProgressTracker />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
      </Routes>
      
    </div>
  )
}

export default App
