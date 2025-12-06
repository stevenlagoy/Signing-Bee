import { KokoroTTS } from 'kokoro-js';

let ttsEngine = null;
let isLoading = false;
let isLoaded = false;
let audioContext = null;
let audioContextInitialized = false;

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

if (typeof window !== 'undefined') {
  const events = ['click', 'touchstart', 'keydown'];
  events.forEach(event => {
    window.addEventListener(event, initAudioContext, { once: true });
  });
}

const load = async () => {
  if (isLoaded) return;
  if (isLoading) {
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  try {
    isLoading = true;
    ttsEngine = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-ONNX', {
      device: 'auto'
    });
    isLoaded = true;
  } catch (error) {
    console.error('Failed to load Kokoro TTS:', error);
    throw error;
  } finally {
    isLoading = false;
  }
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
    const result = await ttsEngine.generate(text, {
      voice: options.voice || 'af_sarah', // 'af_bella' has highest quality but 'af_sarah' was trained for education use cases likely indicating clearer pronunciation
      speed: options.speed ?? .8,       // slower for clarity
      pitch: options.pitch ?? 1.0,
      volume: options.volume ?? 1.5
    });

    const sampleRate = result.sampling_rate || 24000;
    const audioData = result.audio;

    const audioBuffer = audioContext.createBuffer(1, audioData.length, sampleRate);
    audioBuffer.getChannelData(0).set(audioData);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    return new Promise((resolve) => {
      source.onended = resolve;
    });
  } catch (error) {
    console.error('Failed to synthesize speech:', error);
    throw error;
  }
};

const stop = () => {
  if (ttsEngine) {
    ttsEngine.stop?.();
  }
};

const getAvailableVoices = () => {
  return [
    'af_sky',
    'af_bella',
    'af_sarah',
    'af_nicole',
    'am_adam',
    'am_michael',
    'bf_emma',
    'bf_isabella',
    'bm_george',
    'bm_lewis'
  ];
};

const textToSpeech = {
  load,
  speak,
  stop,
  getAvailableVoices,
  isLoaded: () => isLoaded
};

export default textToSpeech;
