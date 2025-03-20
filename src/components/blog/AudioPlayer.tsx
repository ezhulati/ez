import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
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
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const volumeBarRef = useRef<HTMLInputElement | null>(null);
  
  // Get dark mode state from context
  const { isDarkMode } = useAppContext();
  
  // Extract text content from post
  const extractTextFromContent = () => {
    // Simple extraction for plain text
    if (typeof postContent === 'string') {
      return postContent;
    }
    
    // For React content, we'd need a more sophisticated approach
    // This is a simplified version
    try {
      // Convert to string safely
      const contentString = String(postContent);
      
      // Replace all HTML tags with spaces and remove excessive whitespace
      const textOnly = contentString
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return textOnly;
    } catch (error) {
      console.error('Error extracting text from content:', error);
      return '';
    }
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  
  // Handle generating audio from the post content
  const generateAudio = async () => {
    if (audioGenerated) return;
    
    setLoading(true);
    setLoadError(null);
    
    try {
      const textContent = extractTextFromContent();
      
      // Call the API to generate audio
      const response = await fetch('/api/generateAudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textContent,
          postId,
          title: postTitle
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio');
      }
      
      // Set the audio URL and duration
      setAudioUrl(data.audioUrl);
      if (data.duration) {
        setDuration(data.duration);
      }
      setAudioGenerated(true);
      setShowPlayer(true);
    } catch (error) {
      console.error('Error generating audio:', error);
      setLoadError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgressBar);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Update progress bar during playback
  const updateProgressBar = () => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const currentTimeValue = audioRef.current.currentTime;
    progressBarRef.current.value = currentTimeValue.toString();
    setCurrentTime(currentTimeValue);
    
    // Continue the animation loop
    animationRef.current = requestAnimationFrame(updateProgressBar);
  };
  
  // Handle progress bar change when user drags it
  const handleProgressChange = () => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const newTime = parseFloat(progressBarRef.current.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    if (!isPlaying) {
      setCurrentTime(newTime);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = () => {
    if (!audioRef.current || !volumeBarRef.current) return;
    
    const newVolume = parseFloat(volumeBarRef.current.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    
    // If volume is set to 0, mute the audio
    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  };
  
  // Skip forward 10 seconds
  const skipForward = () => {
    if (!audioRef.current) return;
    
    const newTime = Math.min(audioRef.current.currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    if (progressBarRef.current) {
      progressBarRef.current.value = newTime.toString();
    }
  };
  
  // Skip backward 10 seconds
  const skipBackward = () => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    if (progressBarRef.current) {
      progressBarRef.current.value = newTime.toString();
    }
  };
  
  // Handle when audio ends
  const handleAudioEnd = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (audioRef.current && progressBarRef.current) {
      audioRef.current.currentTime = 0;
      progressBarRef.current.value = "0";
      setCurrentTime(0);
    }
  };
  
  // Load audio metadata when the audio is loaded
  const handleLoadedMetadata = () => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const audioDuration = audioRef.current.duration;
    setDuration(audioDuration);
    progressBarRef.current.max = audioDuration.toString();
  };
  
  // Effect to set up audio element when audioUrl changes
  useEffect(() => {
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      
      // Add event listeners
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      
      // Clean up event listeners on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
        }
      };
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);
  
  // Classes based on theme (dark/light mode)
  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-800',
    button: isDarkMode 
      ? 'text-blue-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-600'
      : 'text-blue-600 hover:text-blue-700 bg-gray-100 hover:bg-gray-200',
    generateButton: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-500 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    progressBar: isDarkMode 
      ? 'bg-gray-700'
      : 'bg-gray-200',
    progressFill: isDarkMode 
      ? 'bg-blue-500'
      : 'bg-blue-600'
  };
  
  // Custom styles for progress bar
  const progressBarStyle = {
    background: `linear-gradient(to right, ${isDarkMode ? '#3b82f6' : '#2563eb'} 0%, ${isDarkMode ? '#3b82f6' : '#2563eb'} ${(currentTime / duration) * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${(currentTime / duration) * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`
  };
  
  return (
    <div className={`${className} ${themeClasses.container} rounded-lg border overflow-hidden shadow-md transition-all`}>
      {/* Show Generate Audio button if audio is not yet generated */}
      {!audioGenerated && !loading && (
        <button 
          onClick={generateAudio}
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium ${themeClasses.generateButton} transition-colors`}
          disabled={loading}
        >
          <Volume2 size={18} />
          Listen to this article
        </button>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="w-full py-3 px-4 flex items-center justify-center gap-2 text-sm">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Generating audio...</span>
        </div>
      )}
      
      {/* Error state */}
      {loadError && (
        <div className="w-full py-3 px-4 text-red-500 text-sm text-center">
          <p>Failed to generate audio: {loadError}</p>
          <button 
            onClick={generateAudio}
            className="mt-2 underline hover:text-red-600"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Audio player */}
      {showPlayer && audioUrl && (
        <div className="px-4 py-3">
          {/* Top row with title and time */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium truncate">
              {postTitle.length > 40 ? `${postTitle.substring(0, 40)}...` : postTitle}
            </div>
            <div className="text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="group relative mb-4">
            <input
              ref={progressBarRef}
              type="range"
              min="0"
              max={duration.toString()}
              value={currentTime}
              step="0.01"
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500"
              onChange={handleProgressChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              style={progressBarStyle}
            />
            
            {/* Enhanced hover effect */}
            <div className="absolute -inset-y-1.5 inset-x-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-4 w-full"></div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Left side controls */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={skipBackward}
                className={`p-2 rounded-full ${themeClasses.button} transition-colors`}
                aria-label="Skip backward 10 seconds"
              >
                <SkipBack size={16} />
              </button>
              
              <button 
                onClick={togglePlayPause}
                className={`p-3 rounded-full ${themeClasses.button} transition-colors`}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              
              <button 
                onClick={skipForward}
                className={`p-2 rounded-full ${themeClasses.button} transition-colors`}
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={16} />
              </button>
            </div>
            
            {/* Right side volume controls */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className={`p-2 rounded-full ${themeClasses.button} transition-colors`}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              
              <div className="w-20 hidden sm:block">
                <input
                  ref={volumeBarRef}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, ${isDarkMode ? '#3b82f6' : '#2563eb'} 0%, ${isDarkMode ? '#3b82f6' : '#2563eb'} ${volume * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${volume * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer; 