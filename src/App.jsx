import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Meals from './pages/Meals';
import SimpleMeals from './pages/SimpleMeals';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import TrainerSelection from './Pages/TrainerSelection';
import TrainerDashboard from './pages/TrainerDashboard';
import Guidance from './pages/Guidance';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="app-container">
        <div className="App">
          {user && <Navbar user={user} onLogout={logout} />}
          <Routes>
          <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user} onLogout={logout} />
            </ProtectedRoute>
          } />
          <Route path="/meals" element={
            <ProtectedRoute user={user}>
              <SimpleMeals />
            </ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute user={user}>
              <Workouts user={user} />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute user={user}>
              <Progress user={user} />
            </ProtectedRoute>
          } />
          <Route path="/trainers" element={
            <ProtectedRoute user={user}>
              <TrainerSelection />
            </ProtectedRoute>
          } />
          <Route path="/trainer-dashboard" element={
            <ProtectedRoute user={user}>
              <TrainerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/guidance" element={
            <ProtectedRoute user={user}>
              <Guidance />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;