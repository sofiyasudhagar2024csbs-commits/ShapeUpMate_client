import { useState, useEffect } from 'react';
import MealForm from '../components/MealForm';
import MealTypeSection from '../components/MealTypeSection';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';
import DateTimeHeader from '../components/DateTimeHeader';
import WeekNavigation from '../components/WeekNavigation';
import { meals } from '../services/api';

const Meals = ({ user }) => {
  const [mealList, setMealList] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
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
        showToast('Meal added successfully', 'success');
        return;
      }
      
      await meals.create(mealData);
      fetchMeals();
      showToast('Meal added successfully', 'success');
    } catch (error) {
      showToast('Error adding meal', 'error');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token === 'demo-token') {
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

  const getMealsByType = (type) => {
    return mealList.filter(meal => meal.mealType === type);
  };

  const getMealSummary = () => {
    const types = ['breakfast', 'lunch', 'dinner', 'snacks'];
    return types.map(type => {
      const typeMeals = getMealsByType(type);
      const typeCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const typeInfo = {
        breakfast: { label: 'Breakfast', icon: '🌅', color: '#f59e0b' },
        lunch: { label: 'Lunch', icon: '☀️', color: '#10b981' },
        dinner: { label: 'Dinner', icon: '🌙', color: '#6366f1' },
        snacks: { label: 'Snacks', icon: '🍎', color: '#ef4444' }
      };
      return {
        type,
        ...typeInfo[type],
        calories: typeCalories,
        count: typeMeals.length
      };
    });
  };

  return (
    <div className="container">
      <DateTimeHeader 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />
      
      <WeekNavigation 
        currentWeek={currentWeek} 
        onWeekChange={setCurrentWeek} 
      />
      
      <div className="section-header">
        <div className="icon icon-success">M</div>
        <div>
          <h1 className="section-title">Nutrition Tracking</h1>
          <p className="section-subtitle">Monitor your daily calorie intake and nutrition</p>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Daily Summary</h3>
          <p className="card-subtitle">Your nutrition overview for today</p>
        </div>
        
        <ProgressBar 
          current={totalCalories} 
          goal={goalCalories} 
          label="Daily Calorie Target" 
        />
        
        <div className="meal-summary-grid" style={{ marginTop: '2rem' }}>
          {getMealSummary().map(summary => (
            <div key={summary.type} className="meal-summary-card">
              <span className="meal-summary-icon">{summary.icon}</span>
              <div className="meal-summary-calories" style={{ color: summary.color }}>
                {summary.calories}
              </div>
              <div className="meal-summary-label">{summary.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {summary.count} items
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className={`badge ${totalCalories <= goalCalories ? 'badge-success' : 'badge-warning'}`}>
            {totalCalories <= goalCalories ? `${goalCalories - totalCalories} remaining` : `${totalCalories - goalCalories} over target`}
          </span>
          <span className="badge badge-success">
            {Math.round((totalCalories / goalCalories) * 100)}% of daily goal
          </span>
        </div>
      </div>

      {/* Add Meal Form */}
      <MealForm onAddMeal={handleAddMeal} />

      {/* Meals by Type */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <MealTypeSection 
          mealType="breakfast" 
          meals={mealList} 
          onDeleteMeal={handleDeleteMeal} 
        />
        <MealTypeSection 
          mealType="lunch" 
          meals={mealList} 
          onDeleteMeal={handleDeleteMeal} 
        />
        <MealTypeSection 
          mealType="dinner" 
          meals={mealList} 
          onDeleteMeal={handleDeleteMeal} 
        />
        <MealTypeSection 
          mealType="snacks" 
          meals={mealList} 
          onDeleteMeal={handleDeleteMeal} 
        />
      </div>

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

export default Meals;