import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div className="p-8 text-center text-4xl font-bold text-blue-600">Enterprise Electrical Platform</div>,
  },
  {
    path: '/login',
    element: <div>Login Page</div>,
  },
  {
    path: '/dashboard',
    element: <div>Dashboard</div>,
  }
]);
