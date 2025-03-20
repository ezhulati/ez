import React, { useState, useEffect, useRef } from 'react';
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
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useAppContext();
  const widgetContainerId = `elevenlabs-player-${postId}`;
  
  // Extract text content from post for the player description
  const extractTextExcerpt = () => {
    // Simple extraction for plain text - just get a short excerpt
    try {
      let textContent = '';
      
      if (typeof postContent === 'string') {
        textContent = postContent;
      } else {
        // Basic HTML tag removal for complex content
        textContent = String(postContent).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      // Create a short excerpt (first 150 characters)
      return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
    } catch (error) {
      console.error('Error extracting text excerpt:', error);
      return postTitle;
    }
  };
  
  // Load the Elevenlabs AudioNative player script
  const loadElevenLabsScript = () => {
    if (document.getElementById('elevenlabs-script')) {
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'elevenlabs-script';
    script.src = 'https://elevenlabs.io/player/audioNativeHelper.js';
    script.async = true;
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
      setIsPlayerLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Error loading ElevenLabs script:', error);
    };
    
    document.body.appendChild(script);
  };
  
  // Function to create the widget when the user clicks to listen
  const initializePlayer = () => {
    setIsLoading(true);
    
    // Make sure the script is loaded first
    if (!document.getElementById('elevenlabs-script')) {
      loadElevenLabsScript();
    }
    
    // Create the widget container if it doesn't exist
    const container = document.getElementById(widgetContainerId);
    if (!container) {
      console.error('Widget container not found');
      setIsLoading(false);
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create the widget element
    const widgetElement = document.createElement('div');
    widgetElement.id = 'elevenlabs-audionative-widget';
    widgetElement.setAttribute('data-height', '90');
    widgetElement.setAttribute('data-width', '100%');
    widgetElement.setAttribute('data-frameborder', 'no');
    widgetElement.setAttribute('data-scrolling', 'no');
    widgetElement.setAttribute('data-publicuserid', '0590e54e519cf1a3002d7c0178c75570718d278609b0a051afe42f936dcb04cc');
    widgetElement.setAttribute('data-playerurl', 'https://elevenlabs.io/player/index.html');
    widgetElement.setAttribute('data-title', postTitle);
    widgetElement.setAttribute('data-description', extractTextExcerpt());
    
    widgetElement.innerHTML = 'Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...';
    
    // Add to container
    container.appendChild(widgetElement);
    
    // Trigger the script to initialize the widget
    if (window.ElevenLabsAudioNativeHelper && typeof window.ElevenLabsAudioNativeHelper.initializeAudioNativeWidgets === 'function') {
      window.ElevenLabsAudioNativeHelper.initializeAudioNativeWidgets();
    }
    
    setIsLoading(false);
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
      {!isPlayerLoaded && !isLoading && (
        <button 
          onClick={initializePlayer}
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
      
      {/* ElevenLabs widget container */}
      <div id={widgetContainerId} className="w-full"></div>
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