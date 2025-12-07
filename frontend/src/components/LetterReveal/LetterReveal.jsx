import { useEffect, useState, useRef } from "react";
import styles from "./LetterReveal.module.scss";

const MAX_INCORRECT_GUESSES = 3;

export default function LetterReveal({ word, detectedLetter, onComplete, onFail }) {
  const [revealed, setRevealed] = useState([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [wrongLetter, setWrongLetter] = useState("");
  const [incorrectCount, setIncorrectCount] = useState(0);
  const lastProcessedId = useRef(null);

  //reset when word changes
  useEffect(() => {
    setRevealed(Array.from(word).map(() => false));
    setLetterIndex(0);
    setWrongLetter("");
    setIncorrectCount(0);
    lastProcessedId.current = null;
  }, [word]);

  //feedback for detected letters
  useEffect(() => {
    if (!detectedLetter) return;
    if (letterIndex >= word.length) return;

    // Prevent double-processing the same detection (handles double letters)
    if (detectedLetter.id === lastProcessedId.current) return;
    lastProcessedId.current = detectedLetter.id;

    const inputLetter = detectedLetter.letter;
    if (!inputLetter) return;

    const expected = word[letterIndex].toUpperCase();
    const inputLetterCaps = inputLetter.toUpperCase();

    if (inputLetterCaps === expected) {
      setRevealed((prevRevealed) => {
        const copy = [...prevRevealed];
        copy[letterIndex] = true;
        return copy;
      });

      setWrongLetter("");
      const next = letterIndex + 1;
      setLetterIndex(next);

      if (next >= word.length && onComplete) {
        onComplete();
      }
    } else {
      setWrongLetter(inputLetterCaps);
      const newIncorrectCount = incorrectCount + 1;
      setIncorrectCount(newIncorrectCount);

      if (newIncorrectCount >= MAX_INCORRECT_GUESSES && onFail) {
        onFail();
      }
    }
  }, [detectedLetter, word, onComplete, onFail, letterIndex, incorrectCount]);

  const remainingGuesses = MAX_INCORRECT_GUESSES - incorrectCount;

  return (
    <div className={styles.container}>
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
          <span className={styles.guessText}>
            {remainingGuesses} {remainingGuesses === 1 ? "try" : "tries"} left
          </span>
        </div>
      )}
    </div>
  );
}