import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import RecordsPage from './pages/RecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RemindersPage from './pages/RemindersPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

export default function App() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/*" element={<ProtectedRoute><Layout><Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/patients' element={<PatientsPage />} />
        <Route path='/records' element={<RecordsPage />} />
        <Route path='/appointments' element={<AppointmentsPage />} />
        <Route path='/reminders' element={<RemindersPage />} />
        <Route path='/reports' element={<ReportsPage />} />
      </Routes></Layout></ProtectedRoute>} />
    </Routes>
  );
}
