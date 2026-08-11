import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import RequireAuth from './components/guards/RequireAuth';
import RequireRole from './components/guards/RequireRole';
import PublicLayout from './features/public/components/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

const HomePage = React.lazy(() => import('./features/public/pages/HomePage'));
const AboutUsPage = React.lazy(() => import('./features/public/pages/AboutUsPage'));
const ContactUsPage = React.lazy(() => import('./features/public/pages/ContactUsPage'));
const PublicProductsPage = React.lazy(() => import('./features/public/pages/PublicProductsPage'));
const ProductDetailPage = React.lazy(() => import('./features/public/pages/ProductDetailPage'));
const LoginPage = React.lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./features/auth/pages/RegisterPage'));
const VerifyEmailPage = React.lazy(() => import('./features/auth/pages/VerifyEmailPage'));
const GoogleCallback = React.lazy(() => import('./features/auth/pages/GoogleCallback'));
const CheckoutPage = React.lazy(() => import('./features/public/pages/CheckoutPage'));
const CustomerDashboard = React.lazy(() => import('./features/customers/pages/CustomerDashboard'));
const NotFoundPage = React.lazy(() => import('./features/public/pages/NotFoundPage'));
const PrivacyPolicyPage = React.lazy(() => import('./features/public/pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./features/public/pages/TermsOfServicePage'));
const ForgotPasswordPage = React.lazy(() => import('./features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./features/auth/pages/ResetPasswordPage'));

const DashboardPage = React.lazy(() => import('./features/dashboard/pages/DashboardPage'));
const ProductCatalogPage = React.lazy(() => import('./features/catalog/pages/ProductCatalogPage'));
const CustomersPage = React.lazy(() => import('./features/customers/pages/CustomersPage'));
const PaymentsPage = React.lazy(() => import('./features/payments/pages/PaymentsPage'));
const UsersManagementPage = React.lazy(() => import('./features/dashboard/pages/UsersManagementPage'));
const SettingsPage = React.lazy(() => import('./features/settings/pages/SettingsPage'));
const ContentManagementPage = React.lazy(() => import('./features/dashboard/pages/ContentManagementPage'));
const OrdersManagementPage = React.lazy(() => import('./features/dashboard/pages/OrdersManagementPage'));

const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '', element: <Suspense fallback={<SuspenseFallback />}><HomePage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<SuspenseFallback />}><AboutUsPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<SuspenseFallback />}><ContactUsPage /></Suspense> },
      { path: 'products', element: <Suspense fallback={<SuspenseFallback />}><PublicProductsPage /></Suspense> },
      { path: 'products/:id', element: <Suspense fallback={<SuspenseFallback />}><ProductDetailPage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<SuspenseFallback />}><LoginPage /></Suspense> },
      { path: 'register', element: <Suspense fallback={<SuspenseFallback />}><RegisterPage /></Suspense> },
      { path: 'forgot-password', element: <Suspense fallback={<SuspenseFallback />}><ForgotPasswordPage /></Suspense> },
      { path: 'password-reset', element: <Suspense fallback={<SuspenseFallback />}><ResetPasswordPage /></Suspense> },
      { path: 'verify-email/:id/:hash', element: <Suspense fallback={<SuspenseFallback />}><VerifyEmailPage /></Suspense> },
      { path: 'auth/callback', element: <Suspense fallback={<SuspenseFallback />}><GoogleCallback /></Suspense> },
      { path: 'checkout', element: <RequireAuth><Suspense fallback={<SuspenseFallback />}><CheckoutPage /></Suspense></RequireAuth> },
      { path: 'privacy', element: <Suspense fallback={<SuspenseFallback />}><PrivacyPolicyPage /></Suspense> },
      { path: 'terms', element: <Suspense fallback={<SuspenseFallback />}><TermsOfServicePage /></Suspense> },
      { path: '*', element: <Suspense fallback={<SuspenseFallback />}><NotFoundPage /></Suspense> },
      {
        path: 'customer-dashboard',
        element: (
          <RequireAuth>
            <Suspense fallback={<SuspenseFallback />}>
               <CustomerDashboard />
            </Suspense>
          </RequireAuth>
        ),
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['Super Admin', 'Admin', 'Staff']}>
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Suspense fallback={<SuspenseFallback />}><DashboardPage /></Suspense> },
      { path: 'catalog', element: <Suspense fallback={<SuspenseFallback />}><ProductCatalogPage /></Suspense> },
      { path: 'customers', element: <Suspense fallback={<SuspenseFallback />}><CustomersPage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<SuspenseFallback />}><UsersManagementPage /></Suspense> },
      { path: 'payments', element: <Suspense fallback={<SuspenseFallback />}><PaymentsPage /></Suspense> },
      { path: 'orders', element: <Suspense fallback={<SuspenseFallback />}><OrdersManagementPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<SuspenseFallback />}><SettingsPage /></Suspense> },
      { path: 'content', element: <Suspense fallback={<SuspenseFallback />}><ContentManagementPage /></Suspense> }
    ]
  }
]);
