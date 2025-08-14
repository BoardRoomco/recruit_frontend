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
          <h2 className="mt-2 text-center text-3xl font-fustat font-bold text-graphite">Sign In</h2>
        </div>
        <form className="mt-8 space-y-6 bg-white rounded-2xl shadow-lg p-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-graphite font-dmsans mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-graphite placeholder-gray-400 text-graphite font-dmsans focus:outline-none focus:ring-violet focus:border-violet focus:z-10 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-graphite font-dmsans mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-graphite placeholder-gray-400 text-graphite font-dmsans focus:outline-none focus:ring-violet focus:border-violet focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-violet hover:bg-corePurple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet font-dmsans transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}