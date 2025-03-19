import { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { handleAnchorClick } from '../utils/smoothScroll';
import { useLocation, Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

type NavItem = {
  label: string;
  href: string;
};

type MobileNavigationProps = {
  items: NavItem[];
};

const MobileNavigation: React.FC<MobileNavigationProps> = ({ items }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isScrolled, setIsScheduleOpen } = useAppContext();
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !navRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isMenuOpen]);

  // Handle navigation item click
  const handleNavItemClick = (item: NavItem, e: React.MouseEvent) => {
    // For hash links on homepage
    if (isHomePage && item.href.startsWith('#')) {
      handleAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, 80);
      setIsMenuOpen(false);
    } 
    // For other navigation, just close the menu
    else {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 w-full lg:hidden ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' 
            : 'bg-transparent'
        } transition-all duration-300 z-[9900]`}
        style={{ willChange: 'transform' }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
              <picture>
                <source srcSet="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=32&h=32&fit=crop" type="image/webp" />
                <img 
                  src="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&w=32&h=32&fit=crop" 
                  alt="Enri Zhulati" 
                  className="h-8 w-8 rounded-full object-cover relative z-10 border border-blue-500/30"
                  width="32"
                  height="32"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
            <span className="font-bold text-xl">EZ</span>
          </a>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Menu Button */}
            <button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[9999] p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[9910]"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Content */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 z-[9920] shadow-xl overflow-y-auto flex flex-col"
            >
              {/* Menu Header */}
              <div className="border-b border-gray-200 dark:border-gray-800 py-5 px-6 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 py-4 px-4">
                <nav className="space-y-1">
                  {items.map(item => {
                    // Render links differently based on path type
                    if (item.href.startsWith('#')) {
                      // Only render hash links on home page
                      return isHomePage && (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={(e) => handleNavItemClick(item, e)}
                          className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                        >
                          <span>{item.label}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </a>
                      );
                    } else {
                      // Use Link for non-hash routes
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                        >
                          <span>{item.label}</span>
                          <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </Link>
                      );
                    }
                  })}
                </nav>
                
                {/* Secondary Items */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4">More</h3>
                  <a 
                    href="/resume.html"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <span>Resume</span>
                    <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </a>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        setIsScheduleOpen(true);
                      }, 300);
                    }}
                    className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 w-full text-left"
                  >
                    <span>Schedule Call</span>
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="border-t border-gray-200 dark:border-gray-800 py-4 px-6">
                {isHomePage ? (
                  <a
                    href="#contact"
                    onClick={(e) => {
                      handleAnchorClick(e, 80);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-center font-medium shadow transition-colors"
                  >
                    Contact Me
                  </a>
                ) : (
                  <a
                    href="/#contact"
                    className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-center font-medium shadow transition-colors"
                  >
                    Contact Me
                  </a>
                )}
                <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
                  Need help with your digital presence?
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;