import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import { useState, useEffect } from 'react';
import { Plus, Utensils, Trash2, Save, TrendingUp } from 'lucide-react';
import api from '../lib/axios';
import { mealPlannerQuestions } from '../lib/chatbotData';

const MealPlanner = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentMeal, setCurrentMeal] = useState([]);
  const [mealName, setMealName] = useState('');
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMealPlans();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchFoodsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await api.get('/meals/categories');
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]);
      } else {
        // If no categories found, seed the database
        await seedDatabase();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // If error or no categories, try seeding the database
      await seedDatabase();
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchFoodsByCategory = async (category) => {
    setFoodsLoading(true);
    try {
      const response = await api.get(`/meals/foods?category=${category}`);
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setFoodsLoading(false);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const response = await api.get('/meals/plans');
      setSavedMealPlans(response.data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const seedDatabase = async () => {
    try {
      await api.post('/meals/seed');
      // After seeding, fetch categories again without triggering infinite loop
      const response = await api.get('/meals/categories');
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  const addFoodToMeal = (food) => {
    const existingFood = currentMeal.find(item => item.food._id === food._id);
    if (existingFood) {
      setCurrentMeal(currentMeal.map(item => 
        item.food._id === food._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCurrentMeal([...currentMeal, { food, quantity: 1 }]);
    }
  };

  const removeFoodFromMeal = (foodId) => {
    setCurrentMeal(currentMeal.filter(item => item.food._id !== foodId));
  };

  const updateFoodQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFoodFromMeal(foodId);
      return;
    }
    setCurrentMeal(currentMeal.map(item => 
      item.food._id === foodId 
        ? { ...item, quantity }
        : item
    ));
  };

  const calculateTotals = () => {
    return currentMeal.reduce((totals, item) => {
      return {
        calories: totals.calories + (item.food.calories * item.quantity),
        protein: totals.protein + (item.food.protein * item.quantity)
      };
    }, { calories: 0, protein: 0 });
  };

  const saveMealPlan = async () => {
    if (!mealName.trim() || currentMeal.length === 0) {
      alert('Please enter a meal name and add foods to your plan');
      return;
    }

    setLoading(true);
    try {
      const mealData = {
        name: mealName,
        foods: currentMeal.map(item => ({
          food: item.food._id,
          quantity: item.quantity
        }))
      };

      await api.post('/meals/plans', mealData);
      setMealName('');
      setCurrentMeal([]);
      fetchMealPlans();
      alert('Meal plan saved successfully!');
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Failed to save meal plan');
    } finally {
      setLoading(false);
    }
  };

  const deleteMealPlan = async (planId) => {
    if (confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await api.delete(`/meals/plans/${planId}`);
        fetchMealPlans();
      } catch (error) {
        console.error('Error deleting meal plan:', error);
        alert('Failed to delete meal plan');
      }
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Modal for viewing saved meal plan details */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 btn btn-ghost btn-sm"
              onClick={() => setShowPlanModal(false)}
            >
              Close
            </button>
            <h3 className="text-2xl font-bold text-primary mb-4">{selectedPlan.name}</h3>
            <div className="mb-4">
              <p className="text-base-content/70 mb-1">Created: {new Date(selectedPlan.createdAt).toLocaleString()}</p>
              <p className="font-medium">Total Calories: <span className="text-primary">{selectedPlan.totalCalories}</span> kcal</p>
              <p className="font-medium">Total Protein: <span className="text-secondary">{selectedPlan.totalProtein.toFixed(1)}</span> g</p>
            </div>
            <div className="space-y-3">
              {selectedPlan.foods.map((item, idx) => (
                <div key={idx} className="bg-base-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{item.food?.name || 'Unknown Food'}</span>
                    <span className="badge badge-primary badge-sm">Qty: {item.quantity}</span>
                  </div>
                  <div className="text-xs text-base-content/70">
                    <span>{item.food?.calories * item.quantity} kcal</span> • <span>{item.food?.protein * item.quantity}g protein</span> • <span>{item.food?.serving}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="w-full max-w-7xl mx-auto p-4 mt-6">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">MEAL PLANNER</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food Categories & Selection */}
          <div className="lg:col-span-2">
            {/* Category Selection */}
            <div className="bg-base-200 rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Utensils className="size-5" />
                Food Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoriesLoading ? (
                  <div className="flex gap-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="btn btn-sm btn-outline animate-pulse">Loading...</div>
                    ))}
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`btn btn-sm ${
                        selectedCategory === category ? 'btn-primary' : 'btn-outline btn-primary'
                      } transition-all duration-200`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Food Items */}
            <div className="bg-base-200 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Utensils className="size-5" />
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                <span className="badge badge-primary badge-sm">{foods.length} items</span>
              </h3>
              {foodsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-base-100 rounded-lg p-4 shadow-sm animate-pulse">
                      <div className="h-6 bg-base-300 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-base-300 rounded w-3/4"></div>
                        <div className="h-4 bg-base-300 rounded w-1/2"></div>
                        <div className="h-4 bg-base-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : foods.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <Utensils className="size-16 text-base-content/30" />
                    <div>
                      <p className="text-base-content/70 mb-4">No foods found in this category.</p>
                      <button
                        onClick={seedDatabase}
                        className="btn btn-primary"
                      >
                        Load Sample Foods
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foods.map((food) => (
                    <div key={food._id} className="bg-base-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{food.name}</h4>
                        <button
                          onClick={() => addFoodToMeal(food)}
                          className="btn btn-primary btn-sm hover:btn-primary-focus"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <div className="text-sm text-base-content/70 space-y-1">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-medium">{food.calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{food.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Serving:</span>
                          <span className="font-medium">{food.serving}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Meal Plan */}
          <div className="space-y-6">
            {/* Meal Builder */}
            <div className="bg-base-200 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Utensils className="size-5" />
                Current Meal Plan
              </h3>
              
              <div className="form-control mb-4">
                <input
                  type="text"
                  placeholder="Enter meal name..."
                  className="input input-bordered"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>

              <div className="space-y-3 mb-4">
                {currentMeal.length === 0 ? (
                  <p className="text-center text-base-content/70 py-4">
                    No foods added yet. Select foods from the categories to start building your meal plan.
                  </p>
                ) : (
                  currentMeal.map((item) => (
                    <div key={item.food._id} className="bg-base-100 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.food.name}</span>
                        <button
                          onClick={() => removeFoodFromMeal(item.food._id)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateFoodQuantity(item.food._id, parseInt(e.target.value) || 1)}
                          className="input input-bordered input-xs w-16"
                        />
                        <span className="text-xs text-base-content/70">× {item.food.serving}</span>
                      </div>
                      <div className="text-xs text-base-content/70 mt-1">
                        {item.food.calories * item.quantity} kcal • {item.food.protein * item.quantity}g protein
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              {currentMeal.length > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-4 border border-primary/20">
                  <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <TrendingUp className="size-4" />
                    Total Nutrition Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{totals.calories.toFixed(0)}</p>
                      <p className="text-sm text-base-content/70">Calories (kcal)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">{totals.protein.toFixed(1)}</p>
                      <p className="text-sm text-base-content/70">Protein (g)</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={saveMealPlan}
                disabled={loading || currentMeal.length === 0}
                className="btn btn-primary w-full"
              >
                <Save className="size-4" />
                {loading ? 'Saving...' : 'Save Meal Plan'}
              </button>
            </div>

            {/* Saved Meal Plans */}
            <div className="bg-base-200 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Saved Meal Plans</h3>
              {savedMealPlans.length === 0 ? (
                <p className="text-center text-base-content/70 py-4">
                  No saved meal plans yet. Create your first meal plan above!
                </p>
              ) : (
                <div className="space-y-3">
                  {savedMealPlans.map((plan) => (
                    <div key={plan._id} className="bg-base-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => { setSelectedPlan(plan); setShowPlanModal(true); }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{plan.name}</h4>
                        <button
                          onClick={e => { e.stopPropagation(); deleteMealPlan(plan._id); }}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                      <div className="text-sm text-base-content/70">
                        <p>{plan.totalCalories} kcal • {plan.totalProtein.toFixed(1)}g protein</p>
                        <p className="text-xs">{plan.foods.length} items</p>
                        <p className="text-xs">Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot Component */}
      <Chatbot questions={mealPlannerQuestions} type="meal" />
    </div>
  );
};

export default MealPlanner;
