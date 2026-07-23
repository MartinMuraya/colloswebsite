import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProductCatalogPage from './features/catalog/pages/ProductCatalogPage';

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
      }
    ]
  }
]);
