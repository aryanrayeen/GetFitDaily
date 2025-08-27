import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import BiometricsCard from '../components/BiometricsCard';
import RateLimitedUI from '../components/RateLimitedUI';
import toast from 'react-hot-toast';
import WorkoutCard from '../components/WorkoutCard';
import { PlusIcon } from 'lucide-react';

const Dashboard = () => {
  const [isRateLimited, setIsRateLimiter] = useState(false);
  const [workouts,setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
    
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/habits/leaderboard");
        console.log('Leaderboard data:', res.data);
        setLeaderboardData(res.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        if (error.response?.status !== 429) {
          toast.error("Failed to load leaderboard.");
        }
      } finally {
        setLeaderboardLoading(false);
      }
    };
    
    fetchWorkouts();
    fetchLeaderboard();
  },[]);

  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-3 space-y-8">
            {/* Biometrics Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Personal Biometrics</h2>
              <BiometricsCard />
            </section>

            {/* Workouts Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Workout Plans</h2>
                <Link to="/createworkout" className="btn btn-primary">
                  <PlusIcon className="size-5" />
                  <span>New Workout</span>
                </Link>
              </div>
              {loading && <div className="text-center text-primary py-10">Loading workouts...</div>}
              {workouts.length > 0 && !isRateLimited && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

          {/* Leaderboard - Right Side */}
          <div className="xl:col-span-1">
            <section className="sticky top-6">
              <div className="bg-base-200 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-xl font-bold">Leaderboard</h2>
                </div>
                
                {leaderboardLoading ? (
                  <div className="text-center py-6">
                    <div className="loading loading-spinner loading-md"></div>
                    <p className="text-sm text-base-content/70 mt-2">Loading leaderboard...</p>
                  </div>
                ) : leaderboardData.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboardData.map((user) => (
                      <div 
                        key={user.userId}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          user.rank === 1 
                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200' 
                            : 'bg-base-100 hover:bg-base-300'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-content text-sm font-bold">
                          {user.rank}
                        </div>
                        {/* Only show emojis for top 3 */}
                        {user.rank <= 3 && (
                          <div className="text-2xl">
                            {user.rank === 1 ? '🏆' : user.rank === 2 ? '🥈' : '🥉'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-base-content/70">
                            {user.completedGoals} goals completed
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-base-content/70">No leaderboard data available</p>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-base-300">
                  <button className="w-full btn btn-sm btn-outline">
                    View Full Leaderboard
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;