import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import CreateDelivery from '@/pages/CreateDelivery';
import Deliveries from '@/pages/Deliveries';
import DeliveryDetail from '@/pages/DeliveryDetail';
import CustomerLocation from '@/pages/CustomerLocation';
import Profile from '@/pages/Profile';
import { useDeliveries, useDriver, useAuth } from '@/lib/store';

function ProtectedRoute({ children, isAuthenticated, onLogout }: { children: React.ReactNode; isAuthenticated: boolean; onLogout: () => void }) {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Layout onLogout={onLogout}>{children}</Layout>;
}

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const store = useDeliveries();
  const { driver } = useDriver();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" onLogin={login} />} />
        <Route path="/signup" element={<Auth mode="signup" onLogin={login} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={logout}>
              <Dashboard deliveries={store.deliveries} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-delivery"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={logout}>
              <CreateDelivery onCreate={store.createDelivery} onLinkSent={store.markLinkSent} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveries"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={logout}>
              <Deliveries deliveries={store.deliveries} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveries/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={logout}>
              <DeliveryDetail
                deliveries={store.deliveries}
                onMarkDelivered={store.markDelivered}
                onLinkSent={store.markLinkSent}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} onLogout={logout}>
              <Profile driver={driver} deliveries={store.deliveries} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/d/:deliveryId"
          element={
            <CustomerLocation
              deliveries={store.deliveries}
              onShareLocation={store.shareLocation}
              onCustomerOpened={store.markCustomerOpened}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
