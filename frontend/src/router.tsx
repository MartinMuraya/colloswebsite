import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProductCatalogPage from './features/catalog/pages/ProductCatalogPage';
import CustomersPage from './features/customers/pages/CustomersPage';
import PublicLayout from './features/public/components/PublicLayout';
import HomePage from './features/public/pages/HomePage';
import AboutUsPage from './features/public/pages/AboutUsPage';
import ContactUsPage from './features/public/pages/ContactUsPage';
import SettingsPage from './features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'about', element: <AboutUsPage /> },
      { path: 'contact', element: <ContactUsPage /> },
    ]
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
