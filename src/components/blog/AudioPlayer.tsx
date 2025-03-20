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
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useAppContext();
  
  // Effect to load the AudioNative helper script when the player is shown
  useEffect(() => {
    if (showPlayer) {
      // Check if script is already loaded
      if (!document.getElementById('elevenlabs-script')) {
        const script = document.createElement('script');
        script.id = 'elevenlabs-script';
        script.src = 'https://elevenlabs.io/player/audioNativeHelper.js';
        script.type = 'text/javascript';
        script.async = true;
        
        document.body.appendChild(script);
      }
    }
  }, [showPlayer]);
  
  const handleShowPlayer = () => {
    setIsLoading(true);
    // Short timeout to ensure loading state is shown
    setTimeout(() => {
      setShowPlayer(true);
      setIsLoading(false);
    }, 500);
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
  
  // Create the exact widget HTML that ElevenLabs expects
  const widgetHtml = `
    <div
      id="elevenlabs-audionative-widget"
      data-height="90"
      data-width="100%"
      data-frameborder="no"
      data-scrolling="no"
      data-publicuserid="0590e54e519cf1a3002d7c0178c75570718d278609b0a051afe42f936dcb04cc"
      data-playerurl="https://elevenlabs.io/player/index.html"
    >
      Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...
    </div>
  `;
  
  return (
    <div className={`${className} ${themeClasses.container} rounded-lg border overflow-hidden shadow-md transition-all`}>
      {/* Initial button to load the player */}
      {!showPlayer && !isLoading && (
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
          dangerouslySetInnerHTML={{ __html: widgetHtml }}
        />
      )}
    </div>
  );
};

export default AudioPlayer; 