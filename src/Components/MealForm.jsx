import { useState } from 'react';

const MealForm = ({ onAddMeal }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    mealType: 'breakfast'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.calories) {
      onAddMeal(formData);
      setFormData({ name: '', calories: '', mealType: 'breakfast' });
    }
  };

  return (
    <div className="card">
      <h3>Add Meal</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Meal Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter meal name"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Calories</label>
          <input
            type="number"
            className="form-input"
            value={formData.calories}
            onChange={(e) => setFormData({...formData, calories: e.target.value})}
            placeholder="Enter calories"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Meal Type</label>
          <select
            className="form-input"
            value={formData.mealType}
            onChange={(e) => setFormData({...formData, mealType: e.target.value})}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Meal</button>
      </form>
    </div>
  );
};

export default MealForm;