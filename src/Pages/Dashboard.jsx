import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import MealForm from '../components/mealForm';
import MealList from '../Components/MealList';
import StatsCard from '../Components/StatsCard';
import ProgressBar from '../components/progressBar';
import Toast from '../components/Toast';
import { meals } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [mealList, setMealList] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMeals();
  }, [user, navigate]);

  const fetchMeals = async () => {
    try {
      // Demo mode - use local storage
      const token = localStorage.getItem('token');
      if (token === 'demo-token') {
        const demoMeals = JSON.parse(localStorage.getItem('demoMeals') || '[]');
        setMealList(demoMeals);
        return;
      }

      const response = await meals.getAll();
      setMealList(response.data);
    } catch (error) {
      showToast('Error fetching meals', 'error');
    }
  };

  const handleAddMeal = async (mealData) => {
    try {
      const token = localStorage.getItem('token');
      if (token === 'demo-token') {
        // Demo mode - use local storage
        const demoMeals = JSON.parse(localStorage.getItem('demoMeals') || '[]');
        const newMeal = {
          _id: Date.now().toString(),
          ...mealData,
          calories: parseInt(mealData.calories),
          date: new Date().toISOString()
        };
        demoMeals.push(newMeal);
        localStorage.setItem('demoMeals', JSON.stringify(demoMeals));
        fetchMeals();
        showToast('Meal added successfully!', 'success');
        return;
      }

      await meals.create(mealData);
      fetchMeals();
      showToast('Meal added successfully!', 'success');
    } catch (error) {
      showToast('Error adding meal', 'error');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token === 'demo-token') {
        // Demo mode - use local storage
        const demoMeals = JSON.parse(localStorage.getItem('demoMeals') || '[]');
        const updatedMeals = demoMeals.filter(meal => meal._id !== id);
        localStorage.setItem('demoMeals', JSON.stringify(updatedMeals));
        fetchMeals();
        showToast('Meal removed', 'success');
        return;
      }

      await meals.delete(id);
      fetchMeals();
      showToast('Meal removed', 'success');
    } catch (error) {
      showToast('Error deleting meal', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const totalCalories = mealList.reduce((sum, meal) => sum + meal.calories, 0);
  const goalCalories = 2000;
  const remainingCalories = goalCalories - totalCalories;
  const progressPercentage = (totalCalories / goalCalories) * 100;

  if (!user) return null;

  return (
    <div className="container">
      <Navbar user={user} onLogout={onLogout} />

      {/* Welcome Section */}
      <div className="card fade-in" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Welcome back, {user.name}! 👋</h2>
        <ProgressBar
          current={totalCalories}
          goal={goalCalories}
          label="Daily Calorie Progress"
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span className={`badge ${remainingCalories > 0 ? 'badge-success' : 'badge-warning'}`}>
            {remainingCalories > 0 ? `${remainingCalories} left` : `${Math.abs(remainingCalories)} over`}
          </span>
          <span className="badge badge-success">
            {Math.round(progressPercentage)}% of goal
          </span>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="stats-grid">
        <StatsCard
          number={totalCalories}
          label="Calories Today"
          icon="🔥"
          color="#667eea"
        />
        <StatsCard
          number={goalCalories}
          label="Daily Goal"
          icon="🎯"
          color="#48bb78"
        />
        <StatsCard
          number={remainingCalories}
          label="Remaining"
          icon="⚡"
          color={remainingCalories > 0 ? '#48bb78' : '#e53e3e'}
        />
        <StatsCard
          number={mealList.length}
          label="Meals Logged"
          icon="🍽️"
          color="#ed8936"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        <MealForm onAddMeal={handleAddMeal} />
        <MealList meals={mealList} onDeleteMeal={handleDeleteMeal} />
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;