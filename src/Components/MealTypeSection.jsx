const MealTypeSection = ({ mealType, meals, onDeleteMeal }) => {
  const getMealTypeInfo = (type) => {
    const types = {
      breakfast: { label: 'Breakfast', icon: '🌅', color: '#f59e0b' },
      lunch: { label: 'Lunch', icon: '☀️', color: '#10b981' },
      dinner: { label: 'Dinner', icon: '🌙', color: '#6366f1' },
      snacks: { label: 'Snacks', icon: '🍎', color: '#ef4444' }
    };
    return types[type] || { label: type, icon: '🍽️', color: '#64748b' };
  };

  const typeInfo = getMealTypeInfo(mealType);
  const typeMeals = meals.filter(meal => meal.mealType === mealType);
  const totalCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="card">
      <div className="meal-type-header" style={{ borderLeft: `4px solid ${typeInfo.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{typeInfo.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              {typeInfo.label}
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              {typeMeals.length} items • {totalCalories} calories
            </p>
          </div>
        </div>
        <div className="meal-type-total" style={{ 
          background: typeInfo.color, 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          {totalCalories} cal
        </div>
      </div>

      {typeMeals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#64748b',
          background: '#f8fafc',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>
            {typeInfo.icon}
          </span>
          <p>No {typeInfo.label.toLowerCase()} logged yet</p>
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {typeMeals.map(meal => (
            <div key={meal._id} className="meal-item">
              <div className="meal-info">
                <div className="meal-name">{meal.name}</div>
                <div className="meal-calories">{meal.calories} calories</div>
              </div>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => onDeleteMeal(meal._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealTypeSection;