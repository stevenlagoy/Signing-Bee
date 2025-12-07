import { useEffect, useState, useRef } from "react";
import styles from "./LetterReveal.module.scss";

const MAX_INCORRECT_GUESSES = 3;

export default function LetterReveal({ word, detectedLetter, onComplete, onFail }) {
  const [revealed, setRevealed] = useState([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [wrongLetter, setWrongLetter] = useState("");
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showX, setShowX] = useState(false);

  // Track revealed text like Camera tracks predictedText
  const lastRevealedTextRef = useRef('');
  const lastProcessedIdRef = useRef(null);

  //reset when word changes
  useEffect(() => {
    setRevealed(Array.from(word).map(() => false));
    setLetterIndex(0);
    setWrongLetter("");
    setIncorrectCount(0);
    setShowX(false);
    lastRevealedTextRef.current = '';
    lastProcessedIdRef.current = null;
  }, [word]);

  //feedback for detected letters - mirrors Camera's text accumulation pattern
  useEffect(() => {
    if (!detectedLetter) return;
    if (letterIndex >= word.length) return;

    // Prevent processing the same detection multiple times
    if (detectedLetter.id === lastProcessedIdRef.current) return;

    const inputLetter = detectedLetter.letter;
    if (!inputLetter) return;

    const expected = word[letterIndex].toUpperCase();
    const inputLetterCaps = inputLetter.toUpperCase();

    // Build current revealed text
    const currentRevealedText = revealed
      .map((isRevealed, i) => isRevealed ? word[i].toUpperCase() : '')
      .join('');

    if (inputLetterCaps === expected) {
      // Check if this would extend our revealed text (like Camera checks text length)
      const newRevealedText = currentRevealedText + inputLetterCaps;

      if (newRevealedText.length > lastRevealedTextRef.current.length) {
        lastProcessedIdRef.current = detectedLetter.id;

        setRevealed((prevRevealed) => {
          const copy = [...prevRevealed];
          copy[letterIndex] = true;
          return copy;
        });

        setWrongLetter("");
        const next = letterIndex + 1;
        setLetterIndex(next);
        lastRevealedTextRef.current = newRevealedText;

        if (next >= word.length && onComplete) {
          onComplete();
        }
      }
    } else {
      // Mark as processed BEFORE updating state to prevent loop
      lastProcessedIdRef.current = detectedLetter.id;

      setWrongLetter(inputLetterCaps);
      setIncorrectCount(prev => {
        const newCount = prev + 1;
        if (newCount >= MAX_INCORRECT_GUESSES && onFail) {
          onFail();
        }
        return newCount;
      });

      // Show X animation
      setShowX(true);
      setTimeout(() => setShowX(false), 500);
    }
  }, [detectedLetter, word, onComplete, onFail, letterIndex, revealed]);

  return (
    <div className={styles.container}>
      {showX && <img src="/assets/red-x.svg" alt="Incorrect" className={styles.bigX} />}
      <div className={styles.wordDisplay}>
        {Array.from(word).map((letter, index) => {
          let className = styles.letter;
          let content;

          if (revealed[index]) {
            content = letter.toUpperCase();
            className += ` ${styles.revealed}`;
          } else if (index === letterIndex && wrongLetter) {
            content = wrongLetter;
            className += ` ${styles.incorrect}`;
          } else {
            content = "?";
            className += ` ${styles.hidden}`;
          }

          return (
            <span key={index} className={className}>
              {content}
            </span>
          );
        })}
      </div>
      {word && (
        <div className={styles.guessIndicator}>
          {Array.from({ length: MAX_INCORRECT_GUESSES }).map((_, i) => (
            <span
              key={i}
              className={`${styles.guessDot} ${i < incorrectCount ? styles.used : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}