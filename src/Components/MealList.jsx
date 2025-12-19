const MealList = ({ meals, onDeleteMeal }) => {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const getMealIcon = (mealName) => {
    const name = mealName.toLowerCase();
    if (name.includes('breakfast') || name.includes('cereal') || name.includes('oatmeal')) return '🍳';
    if (name.includes('lunch') || name.includes('sandwich') || name.includes('salad')) return '🥗';
    if (name.includes('dinner') || name.includes('pasta') || name.includes('rice')) return '🍝';
    if (name.includes('snack') || name.includes('fruit') || name.includes('nuts')) return '🍎';
    return '🍽️';
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">📊 Today's Meals</h3>
        <p className="card-subtitle">
          {totalCalories} calories logged • {meals.length} meals
        </p>
      </div>
      
      {meals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          color: '#718096',
          background: '#f7fafc',
          borderRadius: '12px',
          border: '2px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            No meals logged yet today
          </p>
          <p>Start tracking by adding your first meal!</p>
        </div>
      ) : (
        <div>
          {meals.map((meal, index) => (
            <div 
              key={meal._id} 
              className="meal-item fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="meal-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{getMealIcon(meal.name)}</span>
                  <div className="meal-name">{meal.name}</div>
                </div>
                <div className="meal-calories">
                  🔥 {meal.calories} calories
                </div>
              </div>
              <button 
                className="btn btn-danger btn-sm btn-icon" 
                onClick={() => onDeleteMeal(meal._id)}
              >
                <span>🗑️</span>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealList;