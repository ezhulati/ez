import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createHash } from 'crypto';

dotenv.config();

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_e1353b15707f78a2cf2c4f0efd363430add661f80b03792b';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice - Professional male voice

// Create cache directory if it doesn't exist
const CACHE_DIR = path.join(process.cwd(), 'public', 'audio-cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, postId, title } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create a unique filename based on the post ID and content hash
    const contentHash = createHash('md5').update(text).digest('hex');
    const filename = `${postId}-${contentHash}.mp3`;
    const filePath = path.join(CACHE_DIR, filename);
    const publicPath = `/audio-cache/${filename}`;

    // Check if the file already exists in cache
    if (fs.existsSync(filePath)) {
      console.log('Audio file found in cache');
      return res.status(200).json({ 
        audioUrl: publicPath,
        cached: true,
        duration: estimateAudioDuration(filePath)
      });
    }

    console.log('Generating new audio file with ElevenLabs');

    // Truncate text if it's too long (ElevenLabs has limits)
    const truncatedText = text.length > 5000 ? 
      text.substring(0, 5000) + "... The article continues, but this audio preview covers the main points." : 
      text;

    // Generate audio file with ElevenLabs
    const response = await axios({
      method: 'POST',
      url: `${ELEVENLABS_API_URL}/text-to-speech/${VOICE_ID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      data: {
        text: truncatedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'arraybuffer'
    });

    // Save the audio file to the cache directory
    fs.writeFileSync(filePath, response.data);
    
    // Get the audio duration
    const duration = estimateAudioDuration(filePath);

    // Return the public URL to the audio file
    return res.status(200).json({ 
      audioUrl: publicPath, 
      cached: false,
      duration
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return res.status(500).json({ 
      error: 'Failed to generate audio',
      details: error.message
    });
  }
}

// Helper function to estimate audio duration based on file size
function estimateAudioDuration(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    
    // Rough estimate: ~12KB per second of audio for MP3
    return Math.round(fileSizeInBytes / 12000);
  } catch (error) {
    console.error('Error calculating audio duration:', error);
    return 0;
  }
} 