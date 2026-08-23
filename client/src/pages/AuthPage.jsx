import LoginLeft from '@/components/LoginLeft.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@/constants/messages.constants.js';
import { useAppContext } from '@/hook/useAppContext.js';
import { loginSchema, registerSchema } from '@/validations/authSchema.js';
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = ({ mode }) => {
  const { login, register } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const schema = isLogin ? loginSchema : registerSchema;
    const result = schema.safeParse({
      name,
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);

      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      } else {
        await register(name, email, password);
        toast.success(SUCCESS_MESSAGES.ACCOUNT_CREATED);
      }
      navigate('/');
    } catch (error) {
      console.log('auth failed', error);
      const errMsg = error?.response?.data?.error;
      if (mode === 'login') {
        toast.error(errMsg || ERROR_MESSAGES.LOGIN_FAILED);
      } else {
        toast.error(errMsg || ERROR_MESSAGES.REGISTRATION_FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
  }, [mode]);

  return (
    <div className="min-h-screen bg-white flex text-zinc-900 font-sans">
      {/* left Panel - Branding */}
      <LoginLeft />

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-1.5 font-sans">
              {isLogin ? 'Sign in' : 'Create an account'}
            </h1>
            <p className="text-sm text-zinc-400">
              {isLogin
                ? 'Enter your credentials to access your website builder.'
                : 'Get started by entering your registration details.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors"
                  placeholder="Tony Stark"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-2 border-b border-zinc-200 
                    focus:outline-none focus:border-zinc-950 text-sm 
                    text-zinc-900 bg-transparent placeholder-zinc-300 pr-8"
                  placeholder="**********"
                />
                <button
                  className="absolute right-2 top-1/5 -tracking-y-1/2
                     text-zinc-400 hover:text-zinc-600
                     flex items-center justify-center cursor-pointer
                     transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
              className="w-full py-2.5 bg-linear-to-br from-red-600 to-amber-600 text-white font-semibold hover:scale-102 disabled:opacity-40 flex items-center justify-center cursor-pointer mt-2 rounded-lg transition-all"
            >
              {loading && (
                <Loader2Icon className="animate-spin h-3.5 w-3.5 mr-2" />
              )}
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </form>

          <p className="text-sm text-center text-zinc-400 mt-4 pt-2 border-t border-zinc-100 font-sans">
            {isLogin ? (
              <>
                New Here?{' '}
                <Link to="/register" className="text-zinc-900 font-medium">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-zinc-900 font-medium">
                  Sign in here
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
