import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TitleLogo from '../assets/titlelogo.svg';

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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Left: Logo and Browse Jobs */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={TitleLogo} alt="Colare Logo" className="h-10 w-auto" />
            </Link>
            {isAuthenticated && user?.role === 'employer' && (
              <>
                <Link
                  to="/dashboard"
                  className="text-graphite hover:text-violet px-3 py-2 rounded-full text-base font-medium font-dmsans transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/create"
                  className="text-graphite hover:text-violet px-3 py-2 rounded-full text-base font-medium font-dmsans transition"
                >
                  Post Job
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
                <span className="text-base text-graphite font-dmsans">
                  Welcome, {user?.candidate?.firstName || user?.company?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-violet hover:bg-corePurple text-white px-4 py-2 rounded-full text-base font-medium font-dmsans transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-violet font-dmsans font-medium text-base hover:underline transition"
                >
                  Sign In
                </Link>
                <a
                  href="https://calendly.com/boardroomco/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-full bg-violet text-white font-dmsans font-medium text-base shadow hover:bg-corePurple transition"
                >
                  Book a demo
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 inline ml-2">
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