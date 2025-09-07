import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Helper functions for BMI calculation
const calculateBMI = (weight, height) => {
  if (!weight || !height) return 'N/A';
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

const getBMICategory = (bmi) => {
  if (bmi === 'N/A') return { category: 'N/A', color: 'text-base-content' };
  
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
  if (bmiNum < 25) return { category: 'Normal', color: 'text-green-500' };
  if (bmiNum < 30) return { category: 'Overweight', color: 'text-yellow-500' };
  return { category: 'Obese', color: 'text-red-500' };
};

const ProgressTracker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentWaist, setCurrentWaist] = useState('');
  const [currentBodyFat, setCurrentBodyFat] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [waistHistory, setWaistHistory] = useState([]);
  const [bodyFatHistory, setBodyFatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // User data from backend
  const [userInfo, setUserInfo] = useState({
    height: null,
    age: null,
    gender: null,
    currentWeight: null,
    goalWeight: null
  });
  const [goalWeightInput, setGoalWeightInput] = useState('');
  const [goalWeightLoading, setGoalWeightLoading] = useState(false);
  // Update goal weight
  const updateGoalWeight = async () => {
    if (!goalWeightInput) return;
    setGoalWeightLoading(true);
    try {
      const response = await api.post('/biometrics', {
        ...userInfo,
        goalWeight: parseFloat(goalWeightInput)
      });
      if (response.data) {
        setUserInfo(prev => ({ ...prev, goalWeight: parseFloat(goalWeightInput) }));
        setGoalWeightInput('');
      }
    } catch (error) {
      alert('Failed to update goal weight.');
    } finally {
      setGoalWeightLoading(false);
    }
  };

  // Fetch user data and history on component mount
  useEffect(() => {
    fetchUserData();
    fetchWeightHistory();
    fetchWaistHistory();
    fetchBodyFatHistory();
  }, []);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      const response = await api.get('/biometrics');
      if (response.data) {
        setUserInfo({
          height: response.data.height,
          age: response.data.age,
          gender: response.data.gender || 'male',
          currentWeight: response.data.weight,
          goalWeight: response.data.goalWeight || null
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep userInfo as null values when no data exists
    }
  };

  // Fetch weight history
  const fetchWeightHistory = async () => {
    try {
      const response = await api.get('/biometrics/history?type=weight&limit=10');
      const formattedHistory = response.data.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        value: entry.weight,
        timestamp: new Date(entry.date).getTime()
      }));
      setWeightHistory(formattedHistory.reverse());
    } catch (error) {
      console.error('Error fetching weight history:', error);
    }
  };

  // Fetch waist history
  const fetchWaistHistory = async () => {
    try {
      const response = await api.get('/biometrics/history?type=waist&limit=10');
      const formattedHistory = response.data.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        value: entry.waistMeasurement,
        timestamp: new Date(entry.date).getTime()
      }));
      setWaistHistory(formattedHistory.reverse());
    } catch (error) {
      console.error('Error fetching waist history:', error);
    }
  };

  // Fetch body fat history
  const fetchBodyFatHistory = async () => {
    try {
      const response = await api.get('/biometrics/history?type=bodyfat&limit=10');
      const formattedHistory = response.data.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        value: entry.bodyFatPercentage,
        timestamp: new Date(entry.date).getTime()
      }));
      setBodyFatHistory(formattedHistory.reverse());
    } catch (error) {
      console.error('Error fetching body fat history:', error);
    }
  };


  // Calculate progress towards goal
  const calculateProgress = () => {
    if (!userInfo.currentWeight || !userInfo.goalWeight) {
      return 0;
    }
    
    const startWeight = weightHistory.length > 0 ? weightHistory[0].value : userInfo.currentWeight;
    const currentWeightValue = userInfo.currentWeight;
    const goalWeight = userInfo.goalWeight;
    
    const totalChange = Math.abs(goalWeight - startWeight);
    const currentChange = Math.abs(currentWeightValue - startWeight);
    const progressPercent = totalChange > 0 ? (currentChange / totalChange) * 100 : 0;
    
    return Math.min(progressPercent, 100).toFixed(1);
  };

  const currentBMI = calculateBMI(userInfo.currentWeight, userInfo.height);
  const bmiStatus = getBMICategory(currentBMI);
  const progressPercent = calculateProgress();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="w-full max-w-6xl mx-auto p-4 mt-6 transition-all duration-300">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">PROGRESS TRACKER</h2>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Current Weight</h3>
            <p className="text-3xl font-bold text-primary">
              {userInfo.currentWeight ? `${userInfo.currentWeight} kg` : 'No data'}
            </p>
            <div className="flex flex-col items-center gap-2 mt-2">
              <label className="text-sm text-base-content/70">Goal Weight:</label>
              <div className="text-xl font-semibold text-primary">
                {userInfo.goalWeight ? `${userInfo.goalWeight} kg` : 'No data'}
              </div>
            </div>
          </div>
          <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">BMI</h3>
            <p className="text-3xl font-bold text-primary">{currentBMI}</p>
            <p className={`text-sm font-medium ${bmiStatus.color}`}>{bmiStatus.category}</p>
          </div>
          <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Goal Progress</h3>
            <p className="text-3xl font-bold text-primary">{progressPercent}%</p>
            <div className="w-full bg-base-300 rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weight Tracking Section */}
        <section className="bg-base-200 rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Weight Tracking</h3>
          {weightHistory.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3">Weight History</h4>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Weight (kg)" stroke="#6366f1" strokeWidth={2} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Waist Measurement Section */}
        <section className="bg-base-200 rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Waist Measurement</h3>
          {waistHistory.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3">Waist History</h4>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waistHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend />
                    <Bar dataKey="value" name="Waist (cm)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Body Fat Percentage Section */}
        <section className="bg-base-200 rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Body Fat Percentage</h3>
          {bodyFatHistory.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3">Body Fat History</h4>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bodyFatHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend />
                    <Area type="monotone" dataKey="value" name="Body Fat (%)" stroke="#f59e42" fill="#fde68a" strokeWidth={2} dot={true} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* BMI Information */}
        <section className="bg-base-200 rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold text-primary mb-4">BMI Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Your BMI Details</h4>
              <p className="mb-2"><span className="font-medium">Height:</span> {userInfo.height} cm</p>
              <p className="mb-2"><span className="font-medium">Weight:</span> {userInfo.currentWeight} kg</p>
              <p className="mb-2"><span className="font-medium">BMI:</span> {currentBMI}</p>
              <p className={`font-medium ${bmiStatus.color}`}>Category: {bmiStatus.category}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">BMI Categories</h4>
              <ul className="space-y-1 text-sm">
                <li><span className="text-blue-500 font-medium">Underweight:</span> Below 18.5</li>
                <li><span className="text-green-500 font-medium">Normal:</span> 18.5 - 24.9</li>
                <li><span className="text-yellow-500 font-medium">Overweight:</span> 25.0 - 29.9</li>
                <li><span className="text-red-500 font-medium">Obese:</span> 30.0 and above</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProgressTracker;
