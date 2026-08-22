import { Button } from '@/components/ui/button.jsx';
import { AlertTriangle, RefreshCw, House } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';

const PageError = ({ homePath }) => {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-3xl bg-gray-100 p-5">
            <AlertTriangle className="h-12 w-12" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-500">We couldn't load this page.</p>

        {error?.message && (
          <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
            {error.message}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant=""
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>

          <Button
            variant=""
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3"
          >
            Go back
          </Button>
          {homePath && (
            <Link
              to={homePath}
              className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3"
            >
              <House className="h-4 w-4" />
              Go home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageError;
