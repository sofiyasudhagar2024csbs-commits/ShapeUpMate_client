import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Meals from './Pages/Meals';
import SimpleMeals from './Pages/SimpleMeals';
import Workouts from './Pages/Workouts';
import Progress from './Pages/Progress';
import TrainerSelection from './Pages/TrainerSelection';
import TrainerDashboard from './Pages/TrainerDashboard';
import Guidance from './Pages/Guidance';
import NotFound from './Pages/NotFound';
import LoadingSpinner from './components/loadingSpinner';
import ProtectedRoute from './components/protectedRoute';
import Navbar from './components/navbar';
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