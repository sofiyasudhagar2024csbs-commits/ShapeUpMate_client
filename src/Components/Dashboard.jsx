import { useState, useEffect } from 'react';
import { meals } from '../services/api';
import TrainerDashboard from './TrainerDashboard';

const Dashboard = ({ user, onLogout }) => {
  const [mealList, setMealList] = useState([]);
  const [mealForm, setMealForm] = useState({ name: '', calories: '' });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await meals.getAll();
      setMealList(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const addMeal = async (e) => {
    e.preventDefault();
    try {
      await meals.create(mealForm);
      setMealForm({ name: '', calories: '' });
      fetchMeals();
    } catch (error) {
      alert('Error adding meal');
    }
  };

  const deleteMeal = async (id) => {
    try {
      await meals.delete(id);
      fetchMeals();
    } catch (error) {
      alert('Error deleting meal');
    }
  };

  const totalCalories = mealList.reduce((sum, meal) => sum + meal.calories, 0);

  if (user.userType === 'trainer') {
    return (
      <div className="container">
        <div className="header">
          <h1>Welcome, {user.name}! (Trainer)</h1>
          <button className="btn" onClick={onLogout}>Logout</button>
        </div>
        <TrainerDashboard />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome, {user.name}!</h1>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="form">
        <h3>Add Meal</h3>
        <form onSubmit={addMeal}>
          <input
            type="text"
            placeholder="Meal name"
            value={mealForm.name}
            onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={mealForm.calories}
            onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
            required
          />
          <button type="submit" className="btn">Add Meal</button>
        </form>
      </div>

      <div className="form">
        <h3>Today's Calories: {totalCalories}</h3>
        {mealList.map(meal => (
          <div key={meal._id} className="meal-item">
            <div>
              <strong>{meal.name}</strong> - {meal.calories} calories
            </div>
            <button 
              className="btn" 
              onClick={() => deleteMeal(meal._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;