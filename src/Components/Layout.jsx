import Navbar from './Navbar';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="app-container">
      {user && <Navbar user={user} onLogout={onLogout} />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;