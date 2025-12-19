import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/fit.jpeg';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <img src={logo} alt="ShapeUp Mate" style={{ height: '60px', borderRadius: '8px' }} />
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/meals" className="nav-link">Meals</Link>
            <Link to="/workouts" className="nav-link">Workouts</Link>
            <Link to="/progress" className="nav-link">Progress</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span className="nav-user">Welcome, {user.name}!</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;