"use client";

import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiMap, FiUser, FiSettings, FiLogOut, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ResponsiveNav({ 
  user, 
  onLogout, 
  showNotifications = false,
  notificationCount = 0,
  onToggleNotifications 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  const getNavItems = () => {
    const items = [
      { icon: FiHome, label: 'Home', href: '/', mobileOnly: false },
      { icon: FiMap, label: 'Trips', href: '/trips', mobileOnly: false },
    ];

    if (user?.role === 'admin' || user?.role === 'agent') {
      items.push({ 
        icon: FiSettings, 
        label: 'Admin', 
        href: '/admin/dashboard', 
        mobileOnly: false 
      });
    } else if (user?.role === 'agent') {
      items.push({ 
        icon: FiSettings, 
        label: 'Agent', 
        href: '/agent', 
        mobileOnly: false 
      });
    }

    items.push({ 
      icon: FiUser, 
      label: 'Profile', 
      href: '/dashboard/profile', 
      mobileOnly: false 
    });

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white shadow-lg border-b border-gray-200' 
        : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <FiMap className="h-6 w-6" />
              <span className="hidden sm:inline">EthioTravel</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Notifications */}
            {showNotifications && (
              <button
                onClick={onToggleNotifications}
                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiBell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:block">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-base font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Actions */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex items-center space-x-3 px-3 py-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <FiSearch className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                  
                  {showNotifications && (
                    <button
                      onClick={() => {
                        onToggleNotifications();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors relative"
                    >
                      <FiBell className="h-5 w-5" />
                      <span>Notifications</span>
                      {notificationCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="text-base font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
