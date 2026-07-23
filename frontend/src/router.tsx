import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProductCatalogPage from './features/catalog/pages/ProductCatalogPage';
import CustomersPage from './features/customers/pages/CustomersPage';
import SettingsPage from './features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'catalog',
        element: <ProductCatalogPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      }
    ]
  }
]);
