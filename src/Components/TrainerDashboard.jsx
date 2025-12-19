import { useState, useEffect } from 'react';
import { trainers } from '../services/api';

const TrainerDashboard = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await trainers.getUsers();
      setAssignedUsers(response.data);
    } catch (error) {
      console.error('Error loading trainer data:', error);
    }
  };

  return (
    <div className="trainer-dashboard">
      <h2>Trainer Dashboard</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Assigned Users ({assignedUsers.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="assigned-users">
          <h3>Your Assigned Users</h3>
          {assignedUsers.map(assignment => (
            <div key={assignment._id} className="plan-card">
              <h4>{assignment.userId.name}</h4>
              <p>Email: {assignment.userId.email}</p>
              <span>Assigned: {new Date(assignment.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;