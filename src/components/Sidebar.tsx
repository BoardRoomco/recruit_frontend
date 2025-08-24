import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TitleLogo from "../assets/favicon.png";
import { 
  SquaresFour, 
  Briefcase, 
  Users, 
  Gear, 
  SignOut 
} from '@phosphor-icons/react';

const Sidebar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: SquaresFour,
      badge: null,
      allowedRoles: ["employer"]
    },
    {
      name: "Jobs",
      href: "/dashboard/jobs",
      icon: Briefcase,
      badge: "1",
      allowedRoles: ["employer"]
    },
    {
      name: "Candidates",
      href: "/dashboard/candidates",
      icon: Users,
      badge: "12",
      allowedRoles: ["employer"]
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Gear,
      badge: null,
      allowedRoles: ["employer"]
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and Company Branding */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img src={TitleLogo} alt="Colare Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-gray-900">colare</span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {user?.company?.name ? (
              <span className="text-sm font-semibold text-gray-600">
                {user.company.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-sm font-semibold text-gray-600">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.company?.name || user?.candidate?.firstName || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.company?.name ? "Company" : "Candidate"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems
          .filter(item => !item.allowedRoles || item.allowedRoles.includes(user?.role || ""))
          .map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                  }`} 
                  weight="regular" 
                />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full min-w-[20px]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <SignOut className="mr-3 h-5 w-5 text-gray-400" weight="regular" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
