import { useState } from 'react';
import { auth } from '../services/api';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isLogin 
        ? await auth.login(formData)
        : await auth.signup(formData);
      
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button 
          className="btn" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;