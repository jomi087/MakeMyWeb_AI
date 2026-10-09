import PageError from '@/components/common/PageError.jsx';
import AuthLayout from '@/layouts/AuthLayout.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import BuilderPage from '@/pages/BuilderPage.jsx';
import HomePage from '@/pages/HomePage.jsx';
import PreviewPage from '@/pages/PreviewPage.jsx';
import { createBrowserRouter } from 'react-router-dom';
import { PublicRoute } from './PublicRoute.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import PublishPage from '@/pages/PublishPage.jsx';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <PageError />,

    children: [
      // Public routes
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <AuthPage mode="login" />,
          },
          {
            path: '/register',
            element: <AuthPage mode="register" />,
          },
        ],
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/builder/:id',
            element: <BuilderPage />,
          },
          {
            path: '/preview/:id',
            element: <PreviewPage />,
          },
        ],
      },
      {
        path: '/publish/:id',
        element: <PublishPage />,
      },
    ],
  },

  {
    path: '*',
    element: <p>Page Not Found</p>,
  },
]);

export default router;
