import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import BiometricsCard from '../components/BiometricsCard';
import RateLimitedUI from '../components/RateLimitedUI';
import toast from 'react-hot-toast';
import WorkoutCard from '../components/WorkoutCard';

const Dashboard = () => {
  const [isRateLimited, setIsRateLimiter] = useState(false);
  const [workouts,setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get("/workouts");
        console.log(res.data);
        setWorkouts(res.data);
        setIsRateLimiter(false)
      } catch (error) {
        console.log('Error fetching workouts');
        console.error(error);
        if (error.response?.status === 429) {
          setIsRateLimiter(true);
        } else {
          toast.error("Failed to load workouts.");
        }
      } finally {
        setLoading(false);
      }
  };
  
  fetchWorkouts();
},[]);
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6 space-y-8">
        {/* Biometrics Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Personal Biometrics</h2>
          <BiometricsCard />
        </section>

        {/* Workouts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Workout Plans</h2>
          {loading && <div className="text-center text-primary py-10">Loading workouts...</div>}
          {workouts.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout) => (
                <WorkoutCard key={workout._id} workoutplan={workout} setWorkouts={setWorkouts} />
              ))}
            </div>
          )}
          {!loading && workouts.length === 0 && (
            <div className="text-center py-10 text-base-content/70">
              No workout plans yet. Create your first workout plan!
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
export default Dashboard