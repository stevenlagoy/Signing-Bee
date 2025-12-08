import wordGenerator from './wordGenerator';
import textToSpeech from './textToSpeech';

const STORAGE_KEY = 'signingBee.round';
const DEFAULT_DIFFICULTY = 'easy';

let memoryState = {
  word: '',
  difficulty: DEFAULT_DIFFICULTY,
  createdAt: null
};

const getSessionStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const loadState = () => {
  const store = getSessionStorage();

  if (store) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        memoryState = { ...memoryState, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load round state:', error);
    }
  }

  return memoryState;
};

const persistState = (state) => {
  memoryState = state;
  const store = getSessionStorage();
  if (!store) return;

  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist round state:', error);
  }
};

const startRound = async ({ difficulty = DEFAULT_DIFFICULTY, speak = true } = {}) => {
  await textToSpeech.load();

  const current = loadState();

  const word = await wordGenerator.getRandomWord({
    difficulty,
    previousWord: current.word
  });

  const nextState = {
    word,
    difficulty,
    createdAt: Date.now()
  };

  persistState(nextState);

  if (speak) {
    await textToSpeech.speak(word);
  }

  return word;
};

const getCurrentWord = () => {
  const state = loadState();
  return state.word || '';
};

const nextRound = async ({ difficulty, speak = true } = {}) => {
  const current = loadState();
  const nextDifficulty = difficulty || current.difficulty || DEFAULT_DIFFICULTY;

  return startRound({ difficulty: nextDifficulty, speak });
};

const resetRound = () => {
  persistState({
    word: '',
    difficulty: DEFAULT_DIFFICULTY,
    createdAt: Date.now()
  });
};

const speakCurrentWord = async (options = {}) => {
  const word = getCurrentWord();
  if (!word) return null;

  await textToSpeech.speak(word, options);
  return word;
};

const getState = () => loadState();

const signingBeeRound = {
  startRound,
  getCurrentWord,
  nextRound,
  resetRound,
  speakCurrentWord,
  getState
};

export default signingBeeRound;
