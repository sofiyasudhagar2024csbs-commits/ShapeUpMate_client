import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container">
      <div className="form">
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFound;