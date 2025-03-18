import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { isPreviewModeActive, togglePreviewMode } from '../../services/contentful';
import { useAppContext } from '../../context/AppContext';

interface PreviewModeToggleProps {
  className?: string;
}

const PreviewModeToggle = ({ className = "" }: PreviewModeToggleProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { isDarkMode } = useAppContext();
  
  // Initialize state from localStorage
  useEffect(() => {
    setIsPreviewMode(isPreviewModeActive());
  }, []);
  
  const handleToggle = () => {
    const newMode = togglePreviewMode();
    setIsPreviewMode(newMode);
    
    // Reload the page to refresh content
    window.location.reload();
  };
  
  // Check if preview token is available
  const hasPreviewToken = Boolean(import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN);
  
  if (!hasPreviewToken) {
    return null; // Don't show toggle if preview is not configured
  }
  
  return (
    <div className={`fixed bottom-6 left-6 z-40 ${className}`}>
      <button
        onClick={handleToggle}
        className={`group flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all ${
          isPreviewMode
            ? isDarkMode
              ? 'bg-blue-800 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-500'
            : isDarkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title={isPreviewMode ? 'Switch to published content' : 'Switch to preview mode'}
      >
        {isPreviewMode ? (
          <>
            <EyeOff size={16} className="mr-2" />
            <span className="text-sm font-medium">Preview Mode</span>
          </>
        ) : (
          <>
            <Eye size={16} className="mr-2" />
            <span className="text-sm font-medium">Published Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PreviewModeToggle;