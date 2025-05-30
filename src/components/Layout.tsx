import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
  roles: string[];
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Define sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/', icon: 'home', roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'] },
    { name: 'Expenses', path: '/expenses', icon: 'receipt', roles: ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN'] },
    { name: 'Invoices', path: '/invoices', icon: 'description', roles: ['FINANCE', 'ADMIN'] },
    { name: 'Payments', path: '/payments', icon: 'payments', roles: ['FINANCE', 'ADMIN'] },
    { name: 'Approvals', path: '/approvals', icon: 'check_circle', roles: ['MANAGER', 'FINANCE', 'ADMIN'] },
    { name: 'Reports', path: '/reports', icon: 'bar_chart', roles: ['MANAGER', 'FINANCE', 'ADMIN'] },
    { name: 'Users', path: '/users', icon: 'people', roles: ['ADMIN'] },
    { name: 'Settings', path: '/settings', icon: 'settings', roles: ['ADMIN'] },
  ];

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  // Fetch notifications
  useEffect(() => {
    // In a real app, this would be an API call
    // const fetchNotifications = async () => {
    //   const response = await fetch('/api/notifications');
    //   const data = await response.json();
    //   setNotifications(data);
    // };
    // fetchNotifications();

    // Mock notifications for now
    setNotifications([
      { id: 1, title: 'New expense request', message: 'You have a new expense request to approve', isRead: false },
      { id: 2, title: 'Invoice approved', message: 'Your invoice has been approved', isRead: true },
      { id: 3, title: 'Payment completed', message: 'A payment has been completed', isRead: false },
    ]);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
      setIsNotificationsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent event propagation for menu toggles
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-md transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Vietnam Finance</h1>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {filteredSidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined mr-3 flex-shrink-0 h-6 w-6">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open sidebar</span>
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Search */}
            <div className="flex-1 px-4 flex justify-center lg:ml-0">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400">search</span>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>

            {/* Right navigation */}
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={(e) => {
                    handleMenuClick(e);
                    toggleNotifications();
                  }}
                >
                  <span className="sr-only">View notifications</span>
                  <span className="material-symbols-outlined">notifications</span>
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {isNotificationsOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={handleMenuClick}
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      {notifications.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-2 hover:bg-gray-50 ${
                                !notification.isRead ? 'bg-primary-50' : ''
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                      )}
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link
                          to="/notifications"
                          className="text-xs font-medium text-primary hover:text-primary-600"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={(e) => {
                      handleMenuClick(e);
                      toggleUserMenu();
                    }}
                  >
                    <span className="sr-only">Open user menu</span>
                    {currentUser?.avatarUrl ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-800 font-medium">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={handleMenuClick}
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

