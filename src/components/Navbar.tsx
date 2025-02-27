import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Menu, X, User, Search, LogOut } from 'lucide-react';
import { supabase, getUser } from '../lib/supabase';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Stethoscope className="h-8 w-8 text-indigo-600" />
            </motion.div>
            <span className="text-2xl font-bold text-indigo-900">Immedicure</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/search" 
              className={`flex items-center space-x-1 ${
                location.pathname === '/search' 
                  ? 'text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:text-indigo-600'
              } transition-colors`}
            >
              <Search className="w-4 h-4" />
              <span>Find Doctors</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-1 ${
                    location.pathname === '/profile' 
                      ? 'text-indigo-600 font-medium' 
                      : 'text-gray-600 hover:text-indigo-600'
                  } transition-colors`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/auth" className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/search" 
                className={`flex items-center space-x-2 px-4 py-2 ${
                  location.pathname === '/search' 
                    ? 'text-indigo-600 bg-indigo-50 font-medium rounded-lg' 
                    : 'text-gray-600'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Find Doctors</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-2 px-4 py-2 ${
                      location.pathname === '/profile' 
                        ? 'text-indigo-600 bg-indigo-50 font-medium rounded-lg' 
                        : 'text-gray-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-600 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;