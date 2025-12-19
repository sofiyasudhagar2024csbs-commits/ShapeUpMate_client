import { useState, useEffect } from 'react';
import { meals } from '../services/api';

const UserDashboard = ({ user }) => {
  const [mealList, setMealList] = useState([]);
  const [mealForm, setMealForm] = useState({ mealName: '', calories: '' });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await meals.getAll();
      setMealList(response.data.meals || response.data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setMealList([]);
    }
  };

  const addMeal = async (e) => {
    e.preventDefault();
    try {
      await meals.create(mealForm);
      setMealForm({ mealName: '', calories: '' });
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

  return (
    <div className="container">
      <div className="form">
        <h3>Add Meal</h3>
        <form onSubmit={addMeal}>
          <input
            type="text"
            className="form-input"
            placeholder="Meal name"
            value={mealForm.mealName}
            onChange={(e) => setMealForm({...mealForm, mealName: e.target.value})}
            required
          />
          <input
            type="number"
            className="form-input"
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
              <strong>{meal.mealName}</strong> - {meal.calories} calories
              <small style={{display: 'block', color: '#666'}}>
                {new Date(meal.date).toLocaleDateString()}
              </small>
            </div>
            <button 
              className="btn btn-danger btn-sm" 
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

export default UserDashboard;