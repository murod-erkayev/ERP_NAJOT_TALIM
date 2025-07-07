import React from 'react';
import { LogOut, User, Menu, X } from 'lucide-react';

type HeaderProps = {
  title?: string;
  showAuthButtons?: boolean;
  collapsed: boolean;
  onToggle: () => void;
};

const Header: React.FC<HeaderProps> = ({ 
  title = "Admin Panel", 
  showAuthButtons = true, 
  collapsed, 
  onToggle 
}) => {
  const handleLogout = () => {
    // Logout logic
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    // Redirect to login page
    window.location.href = '/';
  };

  const handleSignIn = () => {
    // Redirect to sign in page
    window.location.href = '/';
  };

  const isAuthenticated = localStorage.getItem('authToken'); // Check if user is logged in

  return (
    <header className="bg-slate-800 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white transition-all duration-300 ease-in-out"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              fontWeight: 'bold',
            }}
          >
            {collapsed ? (
              <Menu size={18} />
            ) : (
              <X size={18} />
            )}
          </button>
          
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        {showAuthButtons && (
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <User size={16} />
                  <span>Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;