import { useState, useEffect } from 'react';
import { meals } from '../services/api';

const SimpleMeals = () => {
  const [mealList, setMealList] = useState([]);
  const [mealForm, setMealForm] = useState({ mealName: '', calories: '' });

  const mealOptions = {
    'Oatmeal': 150,
    'Scrambled Eggs': 200,
    'Grilled Chicken': 250,
    'Rice Bowl': 300,
    'Salad': 100,
    'Pasta': 400,
    'Sandwich': 350,
    'Smoothie': 180,
    'Apple': 80,
    'Banana': 105
  };

  const handleMealChange = (mealName) => {
    setMealForm({
      mealName,
      calories: mealOptions[mealName] || ''
    });
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await meals.getAll();
      setMealList(response.data.meals || response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
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
      <h2>Meal Tracker</h2>
      
      <div className="card">
        <h3>Add Meal</h3>
        <form onSubmit={addMeal}>
          <div className="form-group">
            <select
              className="form-input"
              value={mealForm.mealName}
              onChange={(e) => handleMealChange(e.target.value)}
              required
            >
              <option value="">Select Meal</option>
              <option value="Oatmeal">Oatmeal (150 cal)</option>
              <option value="Scrambled Eggs">Scrambled Eggs (200 cal)</option>
              <option value="Grilled Chicken">Grilled Chicken (250 cal)</option>
              <option value="Rice Bowl">Rice Bowl (300 cal)</option>
              <option value="Salad">Salad (100 cal)</option>
              <option value="Pasta">Pasta (400 cal)</option>
              <option value="Sandwich">Sandwich (350 cal)</option>
              <option value="Smoothie">Smoothie (180 cal)</option>
              <option value="Apple">Apple (80 cal)</option>
              <option value="Banana">Banana (105 cal)</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Calories (auto-filled)"
              value={mealForm.calories}
              onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Meal</button>
        </form>
      </div>

      <div className="card">
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

export default SimpleMeals;