import { useState, useEffect } from 'react';
import { trainers } from '../services/api';

const TrainerDashboard = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [guidanceForm, setGuidanceForm] = useState({ userId: '', type: 'meal', description: '' });
  const [activeTab, setActiveTab] = useState('clients');

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  const fetchAssignedUsers = async () => {
    try {
      const response = await trainers.getUsers();
      setAssignedUsers(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const viewUserProgress = async (userId) => {
    try {
      const response = await trainers.getUserProgress(userId);
      setUserProgress(response.data);
      setSelectedUser(userId);
      setActiveTab('progress');
    } catch (error) {
      alert('Error fetching client progress');
    }
  };

  const createGuidance = async (e) => {
    e.preventDefault();
    try {
      await trainers.createGuidance(guidanceForm);
      setGuidanceForm({ userId: '', type: 'meal', description: '' });
      alert('Nutrition plan created successfully!');
    } catch (error) {
      alert('Error creating nutrition plan');
    }
  };

  return (
    <div className="container">
      <h2>Nutritionist Dashboard</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
        >
          My Clients ({assignedUsers.length})
        </button>
        <button 
          className={activeTab === 'plans' ? 'active' : ''}
          onClick={() => setActiveTab('plans')}
        >
          Create Plans
        </button>
        {userProgress && (
          <button 
            className={activeTab === 'progress' ? 'active' : ''}
            onClick={() => setActiveTab('progress')}
          >
            Client Progress
          </button>
        )}
      </div>
      
      {activeTab === 'clients' && (
        <div className="card">
          <h3>My Clients ({assignedUsers.length})</h3>
          {assignedUsers.length === 0 ? (
            <p>No clients assigned yet. Clients will appear here when they select you as their nutritionist.</p>
          ) : (
            assignedUsers.map(assignment => (
              <div key={assignment._id} className="meal-item">
                <div>
                  <strong>{assignment.userId.name}</strong>
                  <br />
                  <small>{assignment.userId.email}</small>
                  <br />
                  <small>Joined: {new Date(assignment.createdAt).toLocaleDateString()}</small>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => viewUserProgress(assignment.userId._id)}
                >
                  View Progress
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="card">
          <h3>Create Nutrition Plan</h3>
          <form onSubmit={createGuidance}>
            <div className="form-group">
              <label className="form-label">Select Client</label>
              <select
                className="form-input"
                value={guidanceForm.userId}
                onChange={(e) => setGuidanceForm({...guidanceForm, userId: e.target.value})}
                required
              >
                <option value="">Select Client</option>
                {assignedUsers.map(assignment => (
                  <option key={assignment._id} value={assignment.userId._id}>
                    {assignment.userId.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Plan Type</label>
              <select
                className="form-input"
                value={guidanceForm.type}
                onChange={(e) => setGuidanceForm({...guidanceForm, type: e.target.value})}
              >
                <option value="meal">Meal Plan</option>
                <option value="workout">Exercise Plan</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Plan Details</label>
              <textarea
                className="form-input"
                placeholder="Enter detailed nutrition/exercise plan..."
                value={guidanceForm.description}
                onChange={(e) => setGuidanceForm({...guidanceForm, description: e.target.value})}
                required
                rows="6"
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Plan</button>
          </form>
        </div>
      )}

      {activeTab === 'progress' && userProgress && (
        <div className="card">
          <h3>Client Progress</h3>
          <div className="dashboard-grid">
            <div>
              <h4>Recent Meals</h4>
              {userProgress.meals.length === 0 ? (
                <p>No meals logged yet</p>
              ) : (
                userProgress.meals.map(meal => (
                  <div key={meal._id} className="meal-item">
                    <div>
                      <span>{meal.mealName} - {meal.calories} cal</span>
                      <small style={{display: 'block'}}>{new Date(meal.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div>
              <h4>Recent Workouts</h4>
              {userProgress.workouts.length === 0 ? (
                <p>No workouts logged yet</p>
              ) : (
                userProgress.workouts.map(workout => (
                  <div key={workout._id} className="meal-item">
                    <div>
                      <span>{workout.workoutName} - {workout.caloriesBurned} cal burned</span>
                      <small style={{display: 'block'}}>{new Date(workout.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;