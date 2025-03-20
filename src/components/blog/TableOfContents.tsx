import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { List, ChevronDown, ChevronUp, Menu, X, ChevronUp as SwipeUpIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface TableOfContentsProps {
  contentSelector: string; // CSS selector for the content container
  headingSelector?: string; // CSS selector for headings
  maxDepth?: number; // Maximum heading depth to include (h1-h6)
  smooth?: boolean; // Whether to use smooth scrolling
  offset?: number; // Offset for scrolling (e.g., for fixed headers)
  title?: string; // Title for the TOC
  containerClassName?: string; // Additional class for the container
}

interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  contentSelector,
  headingSelector = 'h2, h3, h4',
  maxDepth = 3,
  smooth = true,
  offset = 80,
  title = 'Table of Contents',
  containerClassName = '',
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  
  // Swipe related states
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [swipeProgress, setSwipeProgress] = useState<number>(0);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppContext();
  
  // Function to parse headings from content
  const parseHeadings = () => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return [];
    
    const headingElements = Array.from(contentElement.querySelectorAll(headingSelector));
    
    // Filter headings based on maxDepth
    const filteredHeadings = headingElements.filter(element => {
      const level = parseInt(element.tagName.charAt(1));
      return level <= maxDepth;
    });
    
    // Add IDs to headings if they don't have one
    const parsedHeadings = filteredHeadings.map((element, index) => {
      if (!element.id) {
        const text = element.textContent || '';
        const id = `heading-${text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')}-${index}`;
        element.id = id;
      }
      
      return {
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
        element: element as HTMLElement
      };
    });
    
    return parsedHeadings;
  };
  
  // Set up IntersectionObserver to track which heading is in view
  useEffect(() => {
    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      // Create a new IntersectionObserver
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Don't update active heading while user is manually scrolling via TOC
          if (isScrolling) return;
          
          // Find the first visible heading
          const visibleHeadings = entries.filter(entry => entry.isIntersecting);
          
          if (visibleHeadings.length > 0) {
            // Use the first visible heading as active
            setActiveId(visibleHeadings[0].target.id);
          } else if (entries.length > 0) {
            // If no headings are visible, find the one just above the viewport
            const sortedEntries = [...entries].sort((a, b) => {
              const aY = a.boundingClientRect.y;
              const bY = b.boundingClientRect.y;
              return Math.abs(aY) - Math.abs(bY);
            });
            
            setActiveId(sortedEntries[0].target.id);
          }
        },
        { 
          rootMargin: `-${offset}px 0px -20% 0px`,
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      );
      
      // Observe all heading elements
      headings.forEach(heading => {
        if (heading.element) {
          observerRef.current?.observe(heading.element);
        }
      });
    };
    
    if (headings.length > 0) {
      setupObserver();
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings, offset, isScrolling]);
  
  // Extract headings from content when component mounts
  useEffect(() => {
    const extractHeadings = () => {
      const extracted = parseHeadings();
      setHeadings(extracted);
      
      // Set the first heading as active by default
      if (extracted.length > 0 && !activeId) {
        setActiveId(extracted[0].id);
      }
    };
    
    // Allow time for the content to render first
    const timer = setTimeout(extractHeadings, 500);
    
    return () => clearTimeout(timer);
  }, [contentSelector, headingSelector, maxDepth]);
  
  // Handle scroll behavior
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    setIsScrolling(true);
    setActiveId(id);
    
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    
    const topPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    if (smooth) {
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
      
      // Set a timeout to re-enable tracking
      setTimeout(() => setIsScrolling(false), 1000);
    } else {
      window.scrollTo(0, topPosition);
      setIsScrolling(false);
    }
  };
  
  // Toggle mobile TOC
  const toggleMobileToc = () => {
    setIsMobileOpen(!isMobileOpen);
    
    // Prevent scrolling of the body when TOC is open on mobile
    if (!isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Close mobile TOC when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileOpen && tocRef.current && !tocRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
        document.body.style.overflow = '';
      }
    };
    
    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);
  
  // Touch event handlers for swipe-to-dismiss
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchCurrentY(e.touches[0].clientY);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || touchStartY === null) return;
    
    const currentY = e.touches[0].clientY;
    setTouchCurrentY(currentY);
    
    // Calculate swipe distance and direction
    const deltaY = currentY - touchStartY;
    
    // Only allow swiping down to close
    if (deltaY > 0) {
      // Calculate progress percentage (0-100) for animation
      const containerHeight = tocRef.current?.offsetHeight || 300;
      const progress = Math.min(100, (deltaY / containerHeight) * 100);
      setSwipeProgress(progress);
    }
  };
  
  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if swipe was significant enough to close
    // If swipe progress is greater than 20%, close the TOC
    if (swipeProgress > 20) {
      setIsMobileOpen(false);
      document.body.style.overflow = '';
    }
    
    // Reset swipe progress
    setSwipeProgress(0);
    setTouchStartY(null);
    setTouchCurrentY(null);
  };
  
  // If no headings, don't render
  if (headings.length === 0) {
    return null;
  }
  
  // Classes based on theme (dark/light mode)
  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-300'
      : 'bg-white border-gray-200 text-gray-700',
    title: isDarkMode ? 'text-white' : 'text-gray-900',
    activeLink: isDarkMode 
      ? 'text-blue-400 border-blue-500 bg-blue-900/20' 
      : 'text-blue-600 border-blue-500 bg-blue-50',
    inactiveLink: isDarkMode
      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/60'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
    toggleButton: isDarkMode
      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200',
    mobileTrigger: isDarkMode
      ? 'bg-blue-600 border-blue-700 text-white'
      : 'bg-blue-600 border-blue-500 text-white',
    backdrop: isDarkMode
      ? 'bg-gray-900/80'
      : 'bg-gray-800/50',
    swipeIndicator: isDarkMode
      ? 'bg-gray-600'
      : 'bg-gray-300'
  };
  
  // Calculate transform style for swipe effect
  const swipeTransform = isDragging && swipeProgress > 0
    ? { transform: `translateY(${swipeProgress}%)` }
    : {};
  
  return (
    <>
      {/* Mobile TOC Trigger */}
      <button
        onClick={toggleMobileToc}
        className={`lg:hidden fixed right-4 bottom-20 z-40 p-3 rounded-full shadow-lg border ${themeClasses.mobileTrigger} flex items-center justify-center transition-transform toc-mobile-trigger`}
        aria-label="Toggle table of contents"
      >
        <List size={20} />
      </button>
      
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div 
          className={`lg:hidden fixed inset-0 z-40 ${themeClasses.backdrop} backdrop-blur-sm transition-opacity toc-backdrop`}
          onClick={() => {
            setIsMobileOpen(false);
            document.body.style.overflow = '';
          }}
          style={{ 
            opacity: isDragging ? 1 - (swipeProgress / 100) : 1 
          }}
        ></div>
      )}
    
      {/* Main TOC Container */}
      <div 
        ref={tocRef}
        className={`${containerClassName} ${themeClasses.container} border rounded-lg overflow-hidden shadow-lg transition-all duration-300
          lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:max-w-xs lg:w-full lg:overflow-y-auto
          ${isCollapsed ? 'lg:max-h-14' : ''}
          ${isMobileOpen 
            ? 'fixed bottom-16 left-4 right-4 z-50 max-h-[70vh] overflow-y-auto rounded-lg toc-mobile-open animate-slide-up' 
            : 'hidden lg:block'}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={swipeTransform}
      >
        {/* Swipe handle indicator for mobile */}
        {isMobileOpen && (
          <div className="lg:hidden flex justify-center py-1.5 touch-none">
            <div className={`w-12 h-1 rounded-full ${themeClasses.swipeIndicator}`}></div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-inherit">
          <h2 className={`text-base font-semibold ${themeClasses.title} flex items-center`}>
            <Menu size={16} className="mr-2" />
            {title}
          </h2>
          
          {/* Mobile close button */}
          {isMobileOpen && (
            <button
              onClick={toggleMobileToc}
              className={`lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
              aria-label="Close table of contents"
            >
              <X size={18} />
            </button>
          )}
          
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded ${themeClasses.toggleButton} transition-colors lg:block hidden`}
            aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
        
        {/* TOC Links */}
        <nav className={`p-2 ${isCollapsed ? 'lg:hidden' : ''} toc-nav`}>
          <ul className="space-y-1">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              // Calculate indentation based on heading level
              const indentClass = `ml-${(heading.level - 2) * 4}`;
              
              return (
                <li key={heading.id} 
                  className={indentClass}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(heading.id);
                    }}
                    className={`block py-1.5 px-3 text-sm rounded-md border-l-2 transition-all ${
                      isActive 
                        ? `${themeClasses.activeLink} border-l-2 font-medium` 
                        : `${themeClasses.inactiveLink} border-transparent`
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Swipe up to close indicator for mobile */}
        {isMobileOpen && (
          <div className="lg:hidden flex justify-center items-center py-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
            <SwipeUpIcon size={14} className="mr-2" />
            <span>Swipe down to close</span>
          </div>
        )}
      </div>
    </>
  );
};

export default TableOfContents; 