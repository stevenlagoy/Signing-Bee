// Frontend Text-to-Speech service using Google Cloud TTS via backend.

let isLoaded = false;
let audioContext = null;
let audioContextInitialized = false;

const BACKEND_ENDPOINT = '/get-audio'; // Endpoint for Google Cloud TTS on the backend

const initAudioContext = () => {
  if (audioContextInitialized) return;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  audioContextInitialized = true;
};

// Initialize AudioContext on user interaction
if (typeof window !== 'undefined') {
  const events = ['click', 'touchstart', 'keydown'];
  events.forEach(event => {
    window.addEventListener(event, initAudioContext, { once: true });
  });
}

const load = async () => {
  // With backend integration, the TTS engine doesn't need to be loaded client-side.
  // This function can remain as a placeholder or be adapted for any client-side setup
  // that might be needed in the future (e.g., fetching available voices from backend).
  isLoaded = true; // Mark as loaded since it's ready to make API calls
  return Promise.resolve();
};

const speak = async (text, options = {}) => {
  if (!text) return;

  if (!isLoaded) {
    await load();
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  try {
    const response = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: text }), // Send the word to the backend
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend API request failed: ${response.status} - ${errorText}`);
    }

    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();

    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    return new Promise((resolve) => {
      source.onended = resolve;
    });

  } catch (error) {
    console.error('Failed to synthesize speech via backend:', error);
    throw error;
  }
};

const stop = () => {
  // Stopping speech might be handled by interrupting the current AudioContext source
  // For simplicity, we'll leave it as a placeholder as direct interruption of
  // an ongoing AudioBufferSourceNode requires more complex state management.
  console.warn("Stop functionality not fully implemented for Google Cloud TTS via backend.");
};

const textToSpeech = {
  load,
  speak,
  stop,
  isLoaded: () => isLoaded
};

export default textToSpeech;
