import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from './api';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import AttendancePage from './pages/AttendancePage';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ user, children, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppLayout = ({ user, onLogout, children }) => (
  <div className="flex min-h-screen bg-slate-100 text-slate-800">
    <Sidebar user={user} onLogout={onLogout} />
    <main className="flex-1 p-6">{children}</main>
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('sms_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('sms_token'));
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    setAuthToken(null);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('sms_user', JSON.stringify(data.user));
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleLogin = async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('sms_token', data.token);
      localStorage.setItem('sms_user', JSON.stringify(data.user));
      setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed.');
      return { ok: false };
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('sms_token', data.token);
      localStorage.setItem('sms_user', JSON.stringify(data.user));
      setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed.');
      return { ok: false };
    }
  };

  const handleLogout = () => {
    clearSession();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={handleRegister} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} onLogout={handleLogout}>
                <DashboardPage user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'teacher', 'student']}>
              <AppLayout user={user} onLogout={handleLogout}>
                <StudentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'teacher']}>
              <AppLayout user={user} onLogout={handleLogout}>
                <TeachersPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'teacher', 'student']}>
              <AppLayout user={user} onLogout={handleLogout}>
                <AttendancePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'teacher', 'student', 'parent']}>
              <AppLayout user={user} onLogout={handleLogout}>
                <CoursesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} onLogout={handleLogout}>
                <ProfilePage user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
