/**
 * AudioPlayer component was removed due to persistent cross-origin frame issues with ElevenLabs.
 * 
 * Multiple implementation approaches were attempted:
 * 1. Custom audio player with ElevenLabs API integration (server-side)
 * 2. ElevenLabs AudioNative Widget with their helper script
 * 3. Direct iframe embedding of their text-to-speech player
 * 
 * All approaches encountered one or more of the following issues:
 * - Cross-origin frame access errors (blocked by browser security)
 * - ElevenLabs API integration errors
 * - Issues with the ElevenLabs player initialization
 * 
 * If audio playback functionality is needed in the future, consider:
 * - Using the browser's built-in Web Speech API
 * - Server-side text-to-speech generation with local audio files
 * - Alternative TTS services with better embedding support
 */ 