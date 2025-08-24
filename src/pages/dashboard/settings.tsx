import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Gear, Building, User, Shield, Bell } from '@phosphor-icons/react';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-fustat font-bold text-graphite mb-2">Settings</h1>
          <p className="text-graphite font-dmsans text-lg">Manage your account and company preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-violet" weight="regular" />
              </div>
              <h3 className="text-lg font-fustat font-bold text-graphite">Company Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Company Name</span>
                <span className="text-sm font-medium text-graphite font-dmsans">{user?.company?.name || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Industry</span>
                <span className="text-sm font-medium text-graphite font-dmsans">Technology</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Location</span>
                <span className="text-sm font-medium text-graphite font-dmsans">San Francisco, CA</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-violet rounded-lg text-violet font-dmsans font-medium hover:bg-violet hover:text-white transition">
              Edit Company Info
            </button>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-violet" weight="regular" />
              </div>
              <h3 className="text-lg font-fustat font-bold text-graphite">Account Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Email</span>
                <span className="text-sm font-medium text-graphite font-dmsans">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Role</span>
                <span className="text-sm font-medium text-graphite font-dmsans capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Member Since</span>
                <span className="text-sm font-medium text-graphite font-dmsans">2024</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-violet rounded-lg text-violet font-dmsans font-medium hover:bg-violet hover:text-white transition">
              Update Profile
            </button>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-violet" weight="regular" />
              </div>
              <h3 className="text-lg font-fustat font-bold text-graphite">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Two-Factor Auth</span>
                <span className="text-sm font-medium text-red-600 font-dmsans">Disabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Last Login</span>
                <span className="text-sm font-medium text-graphite font-dmsans">Today</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Password</span>
                <span className="text-sm font-medium text-graphite font-dmsans">••••••••</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-violet rounded-lg text-violet font-dmsans font-medium hover:bg-violet hover:text-white transition">
              Security Settings
            </button>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-softLavender rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-violet" weight="regular" />
              </div>
              <h3 className="text-lg font-fustat font-bold text-graphite">Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">New Applications</span>
                <span className="text-sm font-medium text-green-600 font-dmsans">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Job Updates</span>
                <span className="text-sm font-medium text-green-600 font-dmsans">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 font-dmsans">Marketing</span>
                <span className="text-sm font-medium text-red-600 font-dmsans">Disabled</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-violet rounded-lg text-violet font-dmsans font-medium hover:bg-violet hover:text-white transition">
              Notification Settings
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-fustat font-bold text-blue-900 mb-2">More Settings Coming Soon</h3>
          <p className="text-blue-700 font-dmsans">
            We're working on adding more customization options including team management, 
            advanced security features, and integration settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
