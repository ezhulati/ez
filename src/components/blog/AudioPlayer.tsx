import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface AudioPlayerProps {
  postId: string;
  postTitle: string;
  postContent: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  postId, 
  postTitle, 
  postContent,
  className = '' 
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useAppContext();
  
  // Extract a short excerpt from the content
  const extractTextExcerpt = () => {
    try {
      let textContent = '';
      
      if (typeof postContent === 'string') {
        textContent = postContent;
      } else {
        textContent = String(postContent).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      // Create a short excerpt (first 100 characters)
      return textContent.substring(0, 100) + '...';
    } catch (error) {
      console.error('Error extracting text excerpt:', error);
      return postTitle;
    }
  };
  
  const handleShowPlayer = () => {
    setIsLoading(true);
    
    // Set a timeout to allow the loading state to show
    setTimeout(() => {
      setShowPlayer(true);
      setIsLoading(false);
    }, 500);
  };
  
  // Generate a unique ID for the player iframe
  const iframeId = `elevenlabs-player-${postId.substring(0, 8)}`;
  
  // Classes based on theme (dark/light mode)
  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-800',
    button: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-500 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white',
  };
  
  return (
    <div className={`${className} ${themeClasses.container} rounded-lg border overflow-hidden shadow-md transition-all`}>
      {/* Initial button to load the player */}
      {!showPlayer && (
        <button 
          onClick={handleShowPlayer}
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium ${themeClasses.button} transition-colors`}
        >
          <Volume2 size={18} />
          Listen to this article
        </button>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="w-full py-3 px-4 flex items-center justify-center gap-2 text-sm">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Loading audio player...</span>
        </div>
      )}
      
      {/* Direct ElevenLabs iframe embedding - simpler and more reliable */}
      {showPlayer && (
        <div className="w-full">
          <iframe 
            id={iframeId}
            src={`https://elevenlabs.io/text-to-speech/embed/?text=${encodeURIComponent(extractTextExcerpt())}`}
            width="100%" 
            height="100"
            style={{border: 'none', borderRadius: '8px'}}
            allow="autoplay"
            title="ElevenLabs Text to Speech Player"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer; 