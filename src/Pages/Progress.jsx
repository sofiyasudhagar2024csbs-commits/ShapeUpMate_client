import { useState, useEffect } from 'react';
import { meals, workouts } from '../services/api';

const Progress = ({ user }) => {
  const [progressData, setProgressData] = useState({
    totalCalories: 0,
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    avgCaloriesPerDay: 0,
    weeklyGoal: 2000 * 7, // 7 days
    workoutGoal: 5 // 5 workouts per week
  });

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [mealsRes, workoutsRes] = await Promise.all([
        meals.getAll(),
        workouts.getAll()
      ]);
      
      const mealData = mealsRes.data.meals || mealsRes.data;
      const workoutData = workoutsRes.data.workouts || workoutsRes.data;
      
      const totalCalories = mealData.reduce((sum, meal) => sum + meal.calories, 0);
      const totalCaloriesBurned = workoutData.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
      
      // Get user's daily calorie goal or default to 2000
      const dailyGoal = user?.dailyCalorieGoal || 2000;
      const weeklyGoal = dailyGoal * 7;
      
      // Calculate days since first entry for accurate averages
      const allDates = [...mealData.map(m => new Date(m.date)), ...workoutData.map(w => new Date(w.date))];
      const daysSinceStart = allDates.length > 0 ? 
        Math.max(1, Math.ceil((new Date() - Math.min(...allDates)) / (1000 * 60 * 60 * 24))) : 1;
      
      setProgressData({
        totalCalories,
        totalWorkouts: workoutData.length,
        totalCaloriesBurned,
        avgCaloriesPerDay: Math.round(totalCalories / daysSinceStart),
        weeklyGoal,
        workoutGoal: 5,
        daysSinceStart
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const netCalories = progressData.totalCalories - progressData.totalCaloriesBurned;
  const weeklyProgress = (progressData.totalCalories / progressData.weeklyGoal) * 100;
  const workoutProgress = (progressData.totalWorkouts / progressData.workoutGoal) * 100;

  return (
    <div className="container">
      <div className="card fade-in" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h1 className="card-title">Progress Tracking</h1>
        <p className="card-subtitle">Monitor your fitness journey and achievements</p>
      </div>

      {/* Weekly Overview */}
      <div className="card fade-in" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">📈 Weekly Overview</h3>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>Weekly Calorie Goal:</strong> {progressData.totalCalories} / {progressData.weeklyGoal}
          <div style={{background: '#e2e8f0', borderRadius: '8px', height: '20px', margin: '0.5rem 0'}}>
            <div style={{background: '#667eea', height: '100%', borderRadius: '8px', width: `${Math.min((progressData.totalCalories / progressData.weeklyGoal) * 100, 100)}%`}}></div>
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>Weekly Workout Goal:</strong> {progressData.totalWorkouts} / {progressData.workoutGoal}
          <div style={{background: '#e2e8f0', borderRadius: '8px', height: '20px', margin: '0.5rem 0'}}>
            <div style={{background: '#48bb78', height: '100%', borderRadius: '8px', width: `${Math.min((progressData.totalWorkouts / progressData.workoutGoal) * 100, 100)}%`}}></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className={`badge ${weeklyProgress <= 100 ? 'badge-success' : 'badge-warning'}`}>
            {Math.round(weeklyProgress)}% Calorie Goal
          </span>
          <span className={`badge ${workoutProgress >= 100 ? 'badge-success' : 'badge-warning'}`}>
            {Math.round(workoutProgress)}% Workout Goal
          </span>
          <span className={`badge ${netCalories <= 0 ? 'badge-success' : 'badge-danger'}`}>
            {netCalories > 0 ? `+${netCalories}` : netCalories} Net Calories
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{progressData.totalCalories}</span>
          <span className="stat-label">Total Calories</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{progressData.totalCaloriesBurned}</span>
          <span className="stat-label">Calories Burned</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{progressData.totalWorkouts}</span>
          <span className="stat-label">Total Workouts</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{progressData.avgCaloriesPerDay}</span>
          <span className="stat-label">Avg Calories/Day</span>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="dashboard-grid">
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">🏆 Achievements</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={`badge ${progressData.totalWorkouts >= 1 ? 'badge-success' : 'badge-warning'}`}>
              {progressData.totalWorkouts >= 1 ? '✅' : '⏳'} First Workout Complete
            </div>
            <div className={`badge ${progressData.totalCalories >= 2000 ? 'badge-success' : 'badge-warning'}`}>
              {progressData.totalCalories >= 2000 ? '✅' : '⏳'} 2000 Calories Tracked
            </div>
            <div className={`badge ${progressData.totalWorkouts >= 5 ? 'badge-success' : 'badge-warning'}`}>
              {progressData.totalWorkouts >= 5 ? '✅' : '⏳'} 5 Workouts Complete
            </div>
            <div className={`badge ${progressData.totalCaloriesBurned >= 500 ? 'badge-success' : 'badge-warning'}`}>
              {progressData.totalCaloriesBurned >= 500 ? '✅' : '⏳'} 500 Calories Burned
            </div>
          </div>
        </div>

        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">🎯 Goals</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong>Daily Calorie Target:</strong> {user?.dailyCalorieGoal || 2000} cal
            </div>
            <div>
              <strong>Weekly Workout Goal:</strong> 5 sessions
            </div>
            <div>
              <strong>Target Weight:</strong> {user?.weight ? `${user.weight} kg` : 'Not set'}
            </div>
            <div>
              <strong>Fitness Goal:</strong> {user?.goals || 'Not specified'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;