
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components';
import { Dashboard, Teachers, TeacherDetail, Classrooms, Reports, Login, Signup } from './pages';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2ff]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main Layout component - main content starts after sidebar so nothing is hidden
const SIDEBAR_WIDTH = 260;

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#eef2ff]">
      <Sidebar />
      <main
        className="flex-1 min-h-screen overflow-auto bg-white rounded-l-2xl shadow-sm min-w-0 flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:teacherId" element={<TeacherDetail />} />
          <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
