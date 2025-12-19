import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', formData.email);
      const result = await loginUser(formData.email, formData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to home');
        window.location.href = '/';
      } else {
        console.log('Login failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="card-header">
          <h1 className="card-title">Welcome Back</h1>
          <p className="card-subtitle">Sign in to continue your fitness journey</p>
        </div>
        
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          {error && (
            <div className="error-message" style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-link">
          Don't have an account? <Link to="/signup">Create one here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;