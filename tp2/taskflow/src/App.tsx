import ProtectedRoute from './features/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}