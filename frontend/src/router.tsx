import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import VerifyEmailPage from './features/auth/pages/VerifyEmailPage';
import GoogleCallback from './features/auth/pages/GoogleCallback';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProductCatalogPage from './features/catalog/pages/ProductCatalogPage';
import CustomersPage from './features/customers/pages/CustomersPage';
import PaymentsPage from './features/payments/pages/PaymentsPage';
import PublicLayout from './features/public/components/PublicLayout';
import HomePage from './features/public/pages/HomePage';
import AboutUsPage from './features/public/pages/AboutUsPage';
import ContactUsPage from './features/public/pages/ContactUsPage';
import PublicProductsPage from './features/public/pages/PublicProductsPage';
import SettingsPage from './features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'about', element: <AboutUsPage /> },
      { path: 'contact', element: <ContactUsPage /> },
      { path: 'products', element: <PublicProductsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email/:id/:hash', element: <VerifyEmailPage /> },
      { path: 'auth/callback', element: <GoogleCallback /> },
      {
        path: 'dashboard',
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
            path: 'payments',
            element: <PaymentsPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          }
        ]
      }
    ]
  }
]);
