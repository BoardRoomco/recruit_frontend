import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TitleLogo from '../assets/favicon.png';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Navigation: user =', user);
  console.log('Navigation: isAuthenticated =', isAuthenticated);
  console.log('Navigation: user?.role =', user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo and Browse Jobs */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 flex items-center">
              <img src={TitleLogo} alt="Colare Logo" className="h-8 w-auto" />
            </div>
            {isAuthenticated && user?.role === 'employer' && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-violet px-3 py-2 rounded-md text-sm font-medium font-dmsans transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === 'candidate' && (
              <>
                <Link
                  to="/candidate/profile"
                  className="text-graphite hover:text-violet px-3 py-2 rounded-full text-base font-medium font-dmsans transition"
                >
                  Profile
                </Link>
                <Link
                  to="/candidate/applications"
                  className="text-graphite hover:text-violet px-3 py-2 rounded-full text-base font-medium font-dmsans transition"
                >
                  My Applications
                </Link>
              </>
            )}
          </div>
          {/* Right: Book a demo and Sign In/Logout */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-dmsans">
                  Welcome, {user?.candidate?.firstName || user?.company?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-violet hover:bg-corePurple text-white px-3 py-1.5 rounded-md text-sm font-medium font-dmsans transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-violet font-dmsans font-medium text-sm hover:text-violet/80 transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-violet font-dmsans font-medium text-sm hover:text-violet/80 transition-colors"
                >
                  Sign In
                </Link>
                <a
                  href="https://calendly.com/boardroomco/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-md bg-violet text-white font-dmsans font-medium text-sm shadow-sm hover:bg-corePurple transition-colors"
                >
                  Book a demo
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 inline ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3" />
                  </svg>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 