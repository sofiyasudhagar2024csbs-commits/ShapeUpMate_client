import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meals, workouts } from '../services/api';


const Home = ({ user }) => {
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    workouts: 0,
    caloriesBurned: 0
  });

  useEffect(() => {
    if (user) {
      fetchTodayStats();
    }
  }, [user]);

  const fetchTodayStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === 'demo-token') {
        const demoMeals = JSON.parse(localStorage.getItem('demoMeals') || '[]');
        const demoWorkouts = JSON.parse(localStorage.getItem('demoWorkouts') || '[]');
        setTodayStats({
          calories: demoMeals.reduce((sum, meal) => sum + meal.calories, 0),
          workouts: demoWorkouts.length,
          caloriesBurned: demoWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0)
        });
        return;
      }

      const [mealsRes, workoutsRes] = await Promise.all([
        meals.getAll(),
        workouts.getAll()
      ]);

      setTodayStats({
        calories: mealsRes.data.reduce((sum, meal) => sum + meal.calories, 0),
        workouts: workoutsRes.data.length,
        caloriesBurned: workoutsRes.data.reduce((sum, workout) => sum + workout.caloriesBurned, 0)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (user && user.role === 'trainer') {
    return (
      <div className="container">
        <div className="header">
          <h1>Welcome, {user.name}! (Nutritionist)</h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="/trainer-dashboard" className="btn btn-primary">My Clients</a>
            <a href="/guidance" className="btn btn-secondary">Create Plans</a>
          </div>
        </div>
        <div className="card">
          <h3>Trainer Dashboard</h3>
          <p>Manage your clients and create workout plans.</p>
        </div>
      </div>
    );
  }

  if (user && user.role === 'user') {
    return (
      <div className="container">
        <div className="header">
          <h1>Welcome, {user.name}!</h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="/meals" className="btn btn-primary">Meals</a>
            <a href="/workouts" className="btn btn-secondary">Workouts</a>
            <a href="/trainers" className="btn btn-secondary">Select Nutritionist</a>
            <a href="/guidance" className="btn btn-secondary">View Guidance</a>
          </div>
        </div>
        <div className="card">
          <h3>User Dashboard</h3>
          <p>Track your fitness progress and goals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">FitnessPro</h1>
        <p className="hero-subtitle">Your complete fitness tracking solution</p>

        {user && (
          <div className="stats-overview">
            <div className="stat-highlight">
              <h3>{todayStats.calories}</h3>
              <p>Calories Today</p>
            </div>
            <div className="stat-highlight">
              <h3>{todayStats.workouts}</h3>
              <p>Workouts Completed</p>
            </div>
            <div className="stat-highlight">
              <h3>{todayStats.caloriesBurned}</h3>
              <p>Calories Burned</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '0 2rem' }}>
        {/* Welcome Message */}
        {user && (
          <div className="welcome-banner">
            <h2>Welcome back, {user.name}!</h2>
            <p>Ready to continue your fitness journey?</p>
          </div>
        )}

        {/* Feature Cards */}
        <div className="feature-grid">
          <Link to="/meals" className="feature-card">
            <div className="feature-icon icon-success">M</div>
            <h3 className="feature-title">Nutrition Tracking</h3>
            <p className="feature-description">
              Log your daily meals, track calories, and monitor your nutritional intake with our comprehensive food database.
            </p>
          </Link>

          <Link to="/workouts" className="feature-card">
            <div className="feature-icon icon-primary">W</div>
            <h3 className="feature-title">Workout Planning</h3>
            <p className="feature-description">
              Create custom workout routines, track exercises, sets, and reps. Monitor your strength progress over time.
            </p>
          </Link>

          <Link to="/progress" className="feature-card">
            <div className="feature-icon icon-warning">P</div>
            <h3 className="feature-title">Progress Analytics</h3>
            <p className="feature-description">
              Visualize your fitness journey with detailed charts, achievement badges, and comprehensive progress reports.
            </p>
          </Link>

          <Link to="/profile" className="feature-card">
            <div className="feature-icon icon-danger">P</div>
            <h3 className="feature-title">Profile Settings</h3>
            <p className="feature-description">
              Manage your personal information, fitness goals, and account settings in one place.
            </p>
          </Link>
        </div>

        {/* Quick Actions */}
        {user && (
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '2rem', color: '#1a202c' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/meals" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Log a Meal
              </Link>
              <Link to="/workouts" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Start Workout
              </Link>
              <Link to="/progress" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                View Progress
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;