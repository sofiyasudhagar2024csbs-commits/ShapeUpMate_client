import { useState } from 'react';

const MealForm = ({ onAddMeal }) => {
  const [formData, setFormData] = useState({ name: '', calories: '', mealType: '' });
  const [loading, setLoading] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snacks', label: 'Snacks', icon: '🍎' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddMeal(formData);
      setFormData({ name: '', calories: '', mealType: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">Log New Meal</h3>
        <p className="card-subtitle">Track your daily nutrition intake</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Meal Type</label>
          <select
            className="form-input"
            value={formData.mealType}
            onChange={(e) => setFormData({...formData, mealType: e.target.value})}
            required
          >
            <option value="">Select meal type</option>
            {mealTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Meal Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Grilled Chicken Salad"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Calories</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter calorie count"
            value={formData.calories}
            onChange={(e) => setFormData({...formData, calories: e.target.value})}
            required
            min="1"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding Meal...' : 'Add Meal'}
        </button>
      </form>
    </div>
  );
};

export default MealForm;