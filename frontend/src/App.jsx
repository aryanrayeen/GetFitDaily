import { Routes, Route } from 'react-router-dom';

import Dashboard  from './pages/Dashboard';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutPlan from './pages/WorkoutPlan';
import Tutorials from './pages/Tutorials';


const App = () => {
  return (
    <div data-theme="night">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/createworkout" element={<CreateWorkout />} />
        <Route path="/workoutplan/:id" element={<WorkoutPlan />} />
        <Route path="/tutorials" element={<Tutorials />} />
      </Routes>
      
    </div>
  )
}

export default App
