import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentFormPage from './pages/PaymentFormPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Role-based Protected Route component
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpensesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/new"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <RoleProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
              <Layout>
                <InvoicesPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/invoices/:id"
          element={
            <RoleProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
              <Layout>
                <InvoiceDetailPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <RoleProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
              <Layout>
                <PaymentsPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/payments/new"
          element={
            <RoleProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
              <Layout>
                <PaymentFormPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/payments/:id"
          element={
            <RoleProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
              <Layout>
                <PaymentFormPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <UsersPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <SettingsPage />
              </Layout>
            </RoleProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

