import React, { useState, useEffect } from 'react';
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
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useAppContext();
  
  // Effect that runs after the component mounts to initialize the ElevenLabs player
  useEffect(() => {
    if (showPlayer && !playerLoaded) {
      // If window.ElevenLabsAudioNativeHelper is defined, the script has loaded
      if (window.ElevenLabsAudioNativeHelper && 
          typeof window.ElevenLabsAudioNativeHelper.initializeAudioNativeWidgets === 'function') {
        // Initialize the widget - this is a direct call to their API
        try {
          window.ElevenLabsAudioNativeHelper.initializeAudioNativeWidgets();
          console.log('ElevenLabs AudioNative widgets initialized');
          setPlayerLoaded(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing ElevenLabs player:', error);
          setIsLoading(false);
        }
      } else {
        // If the script hasn't loaded yet, try again after a short delay
        console.log('ElevenLabs script not loaded yet, retrying in 1 second...');
        const timer = setTimeout(() => {
          // Try to manually initialize
          const script = document.createElement('script');
          script.src = 'https://elevenlabs.io/player/audioNativeHelper.js';
          script.type = 'text/javascript';
          script.onload = () => {
            if (window.ElevenLabsAudioNativeHelper) {
              window.ElevenLabsAudioNativeHelper.initializeAudioNativeWidgets();
              setPlayerLoaded(true);
              setIsLoading(false);
            }
          };
          document.head.appendChild(script);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [showPlayer, playerLoaded]);
  
  const handleShowPlayer = () => {
    setIsLoading(true);
    setShowPlayer(true);
  };
  
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
      
      {/* ElevenLabs AudioNative Widget */}
      {showPlayer && (
        <div 
          className="w-full" 
          dangerouslySetInnerHTML={{
            __html: `
              <div 
                id="elevenlabs-audionative-widget" 
                data-height="90" 
                data-width="100%" 
                data-frameborder="no" 
                data-scrolling="no" 
                data-text="${postTitle}"
                data-publicuserid="0590e54e519cf1a3002d7c0178c75570718d278609b0a051afe42f936dcb04cc"
                data-playerurl="https://elevenlabs.io/player/index.html"
              >
                Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...
              </div>
            `
          }}
        />
      )}
    </div>
  );
};

// Add this declaration to make TypeScript happy with the global ElevenLabsAudioNativeHelper
declare global {
  interface Window {
    ElevenLabsAudioNativeHelper?: {
      initializeAudioNativeWidgets: () => void;
    };
  }
}

export default AudioPlayer; 