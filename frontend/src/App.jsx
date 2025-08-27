import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Dashboard  from './pages/Dashboard';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutPlan from './pages/WorkoutPlan';
import Tutorials from './pages/Tutorials';
import ZenSection from './pages/ZenSection';
import ProgressTracker from './pages/ProgressTracker';
import MealPlanner from './pages/MealPlanner';
import HabitCalendar from './pages/HabitCalendar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import ProtectedRoute from './components/ProtectedRoute';
import RedirectAuthenticatedUser from './components/RedirectAuthenticatedUser';
import { useAuthStore } from './store/authStore';

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div data-theme="night">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createworkout"
          element={
            <ProtectedRoute>
              <CreateWorkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workoutplan/:id"
          element={
            <ProtectedRoute>
              <WorkoutPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutorials"
          element={
            <ProtectedRoute>
              <Tutorials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zen-section"
          element={
            <ProtectedRoute>
              <ZenSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress-tracker"
          element={
            <ProtectedRoute>
              <ProgressTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal-planner"
          element={
            <ProtectedRoute>
              <MealPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habit-calendar"
          element={
            <ProtectedRoute>
              <HabitCalendar />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </div>
  )
}

export default App
