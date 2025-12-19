import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    phone: '',
    address: '',
    goals: '',
    specialization: '',
    experience: '',
    certification: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    } else if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        phone: user.phone || '',
        address: user.address || '',
        goals: user.goals || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        certification: user.certification || ''
      });
    }
  }, [user]);

  const updateProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setMessage('Profile updated successfully!');
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [mealsRes, workoutsRes] = await Promise.all([
        fetch('http://localhost:5001/api/meals', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5001/api/workouts', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const mealsData = await mealsRes.json();
      const workoutsData = await workoutsRes.json();
      const meals = mealsData.meals || mealsData || [];
      const workouts = workoutsData.workouts || workoutsData || [];

      let csv = 'PERSONAL INFORMATION\n';
      csv += 'Name,Email,Role,Age,Height,Weight,Phone\n';
      csv += `${profileData.name || ''},${profileData.email || ''},${user.role || ''},${profileData.age || ''},${profileData.height || ''},${profileData.weight || ''},${profileData.phone || ''}\n\n`;

      csv += 'MEALS DATA\n';
      csv += 'Date,Meal Name,Calories,Type\n';
      meals.forEach(meal => {
        csv += `${new Date(meal.date).toLocaleDateString()},${meal.mealName},${meal.calories},${meal.mealType || 'other'}\n`;
      });

      csv += '\nWORKOUTS DATA\n';
      csv += 'Date,Workout Name,Calories Burned\n';
      workouts.forEach(workout => {
        csv += `${new Date(workout.date).toLocaleDateString()},${workout.workoutName},${workout.caloriesBurned}\n`;
      });

      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalBurned = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);

      csv += '\nSUMMARY\n';
      csv += 'Total Meals,Total Calories,Total Workouts,Total Burned\n';
      csv += `${meals.length},${totalCalories},${workouts.length},${totalBurned}\n`;

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitness-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Complete data exported successfully!');
    } catch (error) {
      setMessage('Error exporting data');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Profile Settings</h2>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
          <button
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
            style={{ padding: '0.5rem 1rem', border: 'none', background: activeTab === 'personal' ? '#007bff' : 'transparent', color: activeTab === 'personal' ? 'white' : '#007bff' }}
          >
            Personal Information
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
            style={{ padding: '0.5rem 1rem', border: 'none', background: activeTab === 'security' ? '#007bff' : 'transparent', color: activeTab === 'security' ? 'white' : '#007bff' }}
          >
            Account Settings
          </button>
          <button
            className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
            style={{ padding: '0.5rem 1rem', border: 'none', background: activeTab === 'export' ? '#007bff' : 'transparent', color: activeTab === 'export' ? 'white' : '#007bff' }}
          >
            Export Data
          </button>
        </div>

        {message && (
          <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda', color: message.includes('Error') ? '#721c24' : '#155724', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <form onSubmit={updateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.height}
                  onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-input"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Goals</label>
              <textarea
                className="form-input"
                value={profileData.goals}
                onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
                rows="3"
                placeholder="Describe your fitness goals..."
              />
            </div>

            {user?.role === 'trainer' && (
              <>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certification</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.certification}
                    onChange={(e) => setProfileData({ ...profileData, certification: e.target.value })}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}

        {/* Account Settings Tab */}
        {activeTab === 'security' && (
          <form onSubmit={changePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
              <button type="button" className="btn btn-danger" onClick={onLogout}>Logout</button>
            </div>
          </form>
        )}

        {/* Export Data Tab */}
        {activeTab === 'export' && (
          <div>
            <h3>Export Your Data</h3>
            <p>Download all your fitness data including meals, workouts, and profile information as a CSV file.</p>

            <div style={{ padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              <h4>Export includes:</h4>
              <ul>
                <li>Personal information</li>
                <li>All meal entries with calories</li>
                <li>All workout entries with calories burned</li>
                <li>Summary statistics</li>
              </ul>
            </div>

            <button className="btn btn-success" onClick={exportData}>
              Export Data as CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;