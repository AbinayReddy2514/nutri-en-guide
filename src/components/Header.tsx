
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from './Button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user has scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary flex items-center"
          >
            <span className="bg-primary text-white px-2 py-1 rounded-md mr-1">N</span>
            utrienGuide
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    location.pathname === '/profile' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  to="/recommendations" 
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    location.pathname === '/recommendations' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Meal Plan
                </Link>
              </>
            )}
          </nav>
          
          {/* Authentication Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Hi, {user?.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white shadow-md absolute top-full left-0 right-0 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    location.pathname === '/profile' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  to="/recommendations" 
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    location.pathname === '/recommendations' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Meal Plan
                </Link>
              </>
            )}
            
            {/* Authentication Buttons - Mobile */}
            <div className="pt-2 border-t border-border">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Hi, {user?.name}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    fullWidth
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/auth/login" className="w-full">
                    <Button variant="outline" size="sm" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth/signup" className="w-full">
                    <Button variant="primary" size="sm" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
