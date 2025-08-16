import { Routes, Route } from 'react-router-dom';

import Dashboard  from './pages/Dashboard';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutPlan from './pages/WorkoutPlan';
import Tutorials from './pages/Tutorials';
import ZenSection from './pages/ZenSection';


const App = () => {
  return (
    <div data-theme="night">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/createworkout" element={<CreateWorkout />} />
        <Route path="/workoutplan/:id" element={<WorkoutPlan />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/zen-section" element={<ZenSection />} />
      </Routes>
      
    </div>
  )
}

export default App
