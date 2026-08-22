import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout, GuestLayout } from './pages/Layout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import PageError from './components/common/PageError.jsx';
import HomePage from './pages/HomePage.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <PageError />,
    children: [
      {
        element: <HomePage />,
        path: '/',
      },
      {
        element: <BuilderPage />,
        path: '/builder/:id',
      },
      {
        element: <PreviewPage />,
        path: '/preview/:id',
      },
    ],
  },
  {
    element: <GuestLayout />,
    errorElement: <PageError />,
    children: [
      {
        element: <AuthPage mode="login" />,
        path: '/login',
      },
      {
        element: <AuthPage mode="register" />,
        path: '/register',
      },
    ],
  },
  { path: '*', element: <p>Page Not Found</p> },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
