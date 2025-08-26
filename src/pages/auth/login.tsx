import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TitleLogo from '../../assets/titlelogo.svg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('recruit_user') || '{}');
      if (user.role === 'employer') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softLavender flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-3xl font-fustat font-bold text-graphite">Sign In</h2>
        </div>
        <form className="mt-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-graphite font-dmsans mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-graphite font-dmsans focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-violet/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-graphite font-dmsans mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-graphite font-dmsans focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-violet/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-violet to-corePurple hover:from-corePurple hover:to-violet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-dmsans transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 font-dmsans text-sm">{error}</p>
            </div>
          )}
        </form>

        {/* Sign Up Section */}
        <div className="mt-6 text-center">
          <p className="text-graphite font-dmsans">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-violet hover:text-corePurple transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}