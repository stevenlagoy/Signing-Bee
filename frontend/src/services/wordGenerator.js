// Dynamic word generator for Signing Bee rounds.
// Fetches real English words from a dictionary API based on difficulty criteria.

const DEFAULT_DIFFICULTY = 'easy';

// Difficulty configurations based on signing complexity
const DIFFICULTY_CONFIG = {
  easy: {
    minLength: 3,
    maxLength: 5,
    allowDoubleLetters: false
  },
  medium: {
    minLength: 5,
    maxLength: 8,
    allowDoubleLetters: true
  },
  hard: {
    minLength: 8,
    maxLength: 15,
    allowDoubleLetters: true
  }
};

const KUSH_CREATES_API = 'https://random-words-api.kushcreates.com/api';
const RANDOM_WORD_API = 'https://random-word-api.herokuapp.com/word';

const hasDoubleLetters = (word) => {
  for (let i = 0; i < word.length - 1; i++) {
    if (word[i] === word[i + 1]) return true;
  }
  return false;
};

const meetsConfig = (word, config) => {
  if (!config.allowDoubleLetters && hasDoubleLetters(word)) {
    return false;
  }

  if (!/^[a-z]+$/i.test(word)) {
    return false;
  }

  return true;
};

const fetchWordFromAPI = async (difficulty, config) => {
  const length = Math.floor(Math.random() * (config.maxLength - config.minLength + 1)) + config.minLength;
  let response;

  try {
    if (difficulty === 'easy' || difficulty === 'medium') {
      response = await fetch(`${KUSH_CREATES_API}?language=en&length=${length}`);
    } else { // hard
      response = await fetch(`${RANDOM_WORD_API}?length=${length}`);
    }

    if (!response.ok) throw new Error('API request failed');
    const words = await response.json();

    if (Array.isArray(words) && words.length > 0) {
      if (difficulty === 'easy' || difficulty === 'medium') {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex].word;
      }
      return words[0];
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch from word API:', error);
    return null;
  }
};

const getRandomWord = async ({ difficulty = 'easy', previousWord = '' } = {}) => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG['easy'];

  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const word = await fetchWordFromAPI(difficulty, config);

    if (word && meetsConfig(word, config) && word.toLowerCase() !== previousWord.toLowerCase()) {
      return word.toLowerCase();
    }

    attempts++;
  }

  console.warn('Failed to fetch suitable word after max attempts, using fallback');
  return generateFallbackWord(config);
};

// Fallback generator using simple linguistic patterns
const generateFallbackWord = (config) => {
  console.log('Generating fallback word');
  const consonants = 'bcdfghjklmnprstvwz'.split('');
  const vowels = 'aeiou'.split('');

  let word = '';
  const targetLength = Math.floor((config.minLength + config.maxLength) / 2);

  for (let i = 0; i < targetLength; i++) {
    // Alternate consonants and vowels for pronounceability
    if (i % 2 === 0) {
      word += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      word += vowels[Math.floor(Math.random() * vowels.length)];
    }
  }

  return word;
};

// Get all available difficulty levels
const getDifficulties = () => Object.keys(DIFFICULTY_CONFIG);

// Get sample words for a difficulty (for UI preview)
const getSampleWords = async (difficulty = DEFAULT_DIFFICULTY, count = 5) => {
  const words = [];
  const seenWords = new Set();

  let attempts = 0;
  while (words.length < count && attempts < count * 10) {
    const word = await getRandomWord({ difficulty, previousWord: '' });
    if (word && !seenWords.has(word)) {
      words.push(word);
      seenWords.add(word);
    }
    attempts++;
  }

  return words;
};

const wordGenerator = {
  getRandomWord,
  getDifficulties,
  getSampleWords
};

export default wordGenerator;
