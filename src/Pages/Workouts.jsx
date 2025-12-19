import { useState, useEffect } from 'react';
import { workouts } from '../services/api';

const Workouts = () => {
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutForm, setWorkoutForm] = useState({ workoutName: '', caloriesBurned: '' });

  const workoutOptions = {
    'Running': 300,
    'Walking': 150,
    'Cycling': 250,
    'Swimming': 400,
    'Push-ups': 100,
    'Squats': 120,
    'Yoga': 180,
    'Weight Training': 220,
    'Jumping Jacks': 200,
    'Plank': 80
  };

  const handleWorkoutChange = (workoutName) => {
    setWorkoutForm({
      workoutName,
      caloriesBurned: workoutOptions[workoutName] || ''
    });
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workouts.getAll();
      setWorkoutList(response.data.workouts || response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const addWorkout = async (e) => {
    e.preventDefault();
    try {
      await workouts.create(workoutForm);
      setWorkoutForm({ workoutName: '', caloriesBurned: '' });
      fetchWorkouts();
    } catch (error) {
      alert('Error adding workout');
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await workouts.delete(id);
      fetchWorkouts();
    } catch (error) {
      alert('Error deleting workout');
    }
  };

  const totalCaloriesBurned = workoutList.reduce((sum, workout) => sum + workout.caloriesBurned, 0);

  return (
    <div className="container">
      <h2>Workout Tracker</h2>
      
      <div className="card">
        <h3>Log Workout</h3>
        <form onSubmit={addWorkout}>
          <div className="form-group">
            <select
              className="form-input"
              value={workoutForm.workoutName}
              onChange={(e) => handleWorkoutChange(e.target.value)}
              required
            >
              <option value="">Select Workout</option>
              <option value="Running">Running (300 cal/30min)</option>
              <option value="Walking">Walking (150 cal/30min)</option>
              <option value="Cycling">Cycling (250 cal/30min)</option>
              <option value="Swimming">Swimming (400 cal/30min)</option>
              <option value="Push-ups">Push-ups (100 cal/15min)</option>
              <option value="Squats">Squats (120 cal/15min)</option>
              <option value="Yoga">Yoga (180 cal/45min)</option>
              <option value="Weight Training">Weight Training (220 cal/30min)</option>
              <option value="Jumping Jacks">Jumping Jacks (200 cal/20min)</option>
              <option value="Plank">Plank (80 cal/10min)</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Calories burned (auto-filled)"
              value={workoutForm.caloriesBurned}
              onChange={(e) => setWorkoutForm({...workoutForm, caloriesBurned: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Log Workout</button>
        </form>
      </div>

      <div className="card">
        <h3>Total Calories Burned: {totalCaloriesBurned}</h3>
        {workoutList.map(workout => (
          <div key={workout._id} className="meal-item">
            <div>
              <strong>{workout.workoutName}</strong> - {workout.caloriesBurned} calories burned
              <small style={{display: 'block', color: '#666'}}>
                {new Date(workout.date).toLocaleDateString()}
              </small>
            </div>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={() => deleteWorkout(workout._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;