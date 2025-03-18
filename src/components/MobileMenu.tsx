import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MobileMenuProps = {
  items: {
    label: string;
    href: string;
  }[];
};

const MobileMenu: React.FC<MobileMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('#mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    // Close menu when ESC key is pressed
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div id="mobile-menu-container" className="lg:hidden relative z-[200]">
      <button
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to prevent clicks on background elements */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" 
              onClick={() => setIsOpen(false)}
              style={{ position: 'fixed' }}
            />
            
            {/* Menu content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-b border-gray-200 dark:border-gray-800 z-[150] py-6 overflow-auto"
              style={{ position: 'fixed' }}
            >
              <nav className="flex flex-col px-4 space-y-1 max-w-lg mx-auto">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="py-3 px-5 text-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 rounded-lg transition-colors flex justify-between items-center group border-b border-gray-100 dark:border-gray-800/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
                
                <div className="pt-6">
                  <a 
                    href="#contact"
                    className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-blue-500/30"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Work with me</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;