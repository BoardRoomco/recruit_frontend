import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import TitleLogo from "../assets/titlelogo.svg";
import RivianCarImage from "../assets/rivian car.jpg";
import { 
  SquaresFour, 
  Briefcase, 
  Users, 
  Gear, 
  SignOut,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';

const Sidebar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();

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
    <div className={`fixed left-0 top-0 h-full bg-gray-100 border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo and Company Branding */}
      <div className="p-6 border-b border-gray-200 relative">
        <div className="flex items-center justify-start">
          <img src={TitleLogo} alt="Colare Logo" className="h-7 w-auto" />
        </div>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          {isCollapsed ? (
            <CaretRight className="h-3 w-3 text-gray-600" weight="bold" />
          ) : (
            <CaretLeft className="h-3 w-3 text-gray-600" weight="bold" />
          )}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {(user?.candidate?.profilePicture || user?.company?.logo || user?.profilePicture) ? (
              <img 
                src={user?.candidate?.profilePicture || user?.company?.logo || user?.profilePicture || RivianCarImage} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={RivianCarImage} 
                alt="Default Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.company?.name || user?.candidate?.firstName || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.company?.name ? "Company" : "Candidate"}
              </p>
            </div>
          )}
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
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon 
                  className={`h-5 w-5 ${
                    isActive ? "text-violet" : "text-gray-500 group-hover:text-gray-600"
                  } ${isCollapsed ? 'mx-auto' : 'mr-3'}`} 
                  weight="regular" 
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full min-w-[20px]">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
      </nav>

      {/* Logout Section */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <SignOut className={`h-5 w-5 text-gray-500 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} weight="regular" />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
