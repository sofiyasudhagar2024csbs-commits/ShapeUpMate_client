const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <h1>Fitness Planner</h1>
      {user && (
        <div>
          <span>Welcome, {user.name}!</span>
          <button className="btn" onClick={onLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;