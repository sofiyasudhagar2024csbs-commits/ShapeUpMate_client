const MealTypeSection = ({ mealType, meals, onDeleteMeal }) => {
  const typeMeals = meals.filter(meal => meal.mealType === mealType);
  const totalCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);

  const typeInfo = {
    breakfast: { label: 'Breakfast', icon: '🌅' },
    lunch: { label: 'Lunch', icon: '☀️' },
    dinner: { label: 'Dinner', icon: '🌙' },
    snacks: { label: 'Snacks', icon: '🍎' }
  };

  return (
    <div className={`meal-type-section ${mealType}`}>
      <div className="meal-type-header">
        <h4>{typeInfo[mealType].icon} {typeInfo[mealType].label}</h4>
        <span className="meal-type-total">{totalCalories} cal</span>
      </div>
      {typeMeals.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
          No {mealType} logged yet
        </p>
      ) : (
        typeMeals.map(meal => (
          <div key={meal._id} className="meal-item">
            <div>
              <strong>{meal.name}</strong>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                {meal.calories} calories
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteMeal(meal._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MealTypeSection;