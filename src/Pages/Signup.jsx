import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'user',
    specialization: '', experience: '', certification: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signupUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signupUser(formData);
      
      if (result.success) {
        window.location.href = '/';
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="card-header">
          <h1 className="card-title">Join FitnessPro</h1>
          <p className="card-subtitle">Start your fitness journey today</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength="6"
            />
            <small style={{ color: '#718096', fontSize: '0.8rem' }}>
              Password must be at least 6 characters long
            </small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              className="form-input"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="user">Regular User</option>
              <option value="trainer">Nutritionist</option>
            </select>
          </div>
          
          {formData.role === 'trainer' && (
            <>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select
                  className="form-input"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="nutrition">Nutritionist</option>
                  <option value="dietitian">Dietitian</option>
                  <option value="sports-nutrition">Sports Nutritionist</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Years of experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  required
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Certification</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Professional certification"
                  value={formData.certification}
                  onChange={(e) => setFormData({...formData, certification: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Contact number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </>
          )}
          
          {error && (
            <div className="error-message" style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;