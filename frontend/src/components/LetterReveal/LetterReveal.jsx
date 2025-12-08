import { useEffect, useState, useRef } from "react";
import styles from "./LetterReveal.module.scss";

const MAX_INCORRECT_GUESSES = 3;

export default function LetterReveal({ word, detectedLetter, onComplete, onFail, onCorrectLetter }) {
  const [revealed, setRevealed] = useState([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [wrongLetter, setWrongLetter] = useState("");
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFlippingOut, setIsFlippingOut] = useState(false);

  // Track revealed text like Camera tracks predictedText
  const lastRevealedTextRef = useRef('');
  const lastProcessedIdRef = useRef(null);
  const isPaused = useRef(false);

  // Keep audio instances stable so we don't re-request the mp3s on every render
  const audioCorrectRef = useRef(null);
  const audioWrongRef = useRef(null);

  useEffect(() => {
    audioCorrectRef.current = new Audio("/correct.mp3");
    audioWrongRef.current = new Audio("/wrong.mp3");

    return () => {
      [audioCorrectRef.current, audioWrongRef.current].forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  //reset when word changes
  useEffect(() => {
    setRevealed(Array.from(word).map(() => false));
    setLetterIndex(0);
    setWrongLetter("");
    setIncorrectCount(0);
    setIsComplete(false);
    setIsFlippingOut(false);
    isPaused.current = false;
    lastRevealedTextRef.current = '';
    lastProcessedIdRef.current = null;
  }, [word]);

  //incoming letters
  useEffect(() => {
    if (!detectedLetter) return;
    if (letterIndex >= word.length) return;
    if (isComplete || isFlippingOut) return;

    //pause a moment to not immediately reprocess same letter
    if (isPaused.current) return;

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

        if (onCorrectLetter) {
          onCorrectLetter();
        }

        if (audioCorrectRef.current) {
          audioCorrectRef.current.currentTime = 0;
          audioCorrectRef.current.play().catch((e) => console.log("Audio play failed", e));
        }

        //question mark flip animation swap to letter
        setIsFlippingOut(true);
        setTimeout(() => {
          setRevealed((prevRevealed) => {
            const copy = [...prevRevealed];
            copy[letterIndex] = true;
            return copy;
          });

          setIsFlippingOut(false);

          //completed letter reveal, move to next letter
          setWrongLetter("");
          const next = letterIndex + 1;
          setLetterIndex(next);
          lastRevealedTextRef.current = newRevealedText;

          if (next >= word.length) {
            setTimeout(() => {
              setIsComplete(true);
            }, 100);

            setTimeout(() => {
              if (onComplete) onComplete();
            }, 1200);

          } else {
            isPaused.current = true;
            setTimeout(() => {
              isPaused.current = false;
            }, 1000);
          }
        }, 200);
      }
    } else {
      // Mark as processed BEFORE updating state to prevent loop
      lastProcessedIdRef.current = detectedLetter.id;

      if (audioWrongRef.current) {
        audioWrongRef.current.currentTime = 0;
        audioWrongRef.current.play().catch((e) => console.log("Audio play failed", e));
      }
      setWrongLetter(inputLetterCaps);

      setIncorrectCount(prev => {
        const newCount = prev + 1;
        if (newCount >= MAX_INCORRECT_GUESSES && onFail) {
          onFail();
        }
        return newCount;
      });
    }
  }, [detectedLetter, word, onComplete, onFail, onCorrectLetter, letterIndex, revealed, isComplete, isFlippingOut]);

  return (
    <div className={styles.container}>
      <div className={`${styles.wordDisplay} ${isComplete ? styles.bounceComplete : ''}`}>
        {Array.from(word).map((letter, index) => {
          let className = styles.letter;
          let content;
          let isCurrentLetter = index === letterIndex;
          let isQuestionMark = !revealed[index] && !wrongLetter;

          if (revealed[index]) {
            content = letter.toUpperCase();
            className += ` ${styles.revealed}`;
          } else if (isCurrentLetter && wrongLetter) {
            content = wrongLetter;
            className += ` ${styles.incorrect}`;
          } else {
            content = "?";
            className += ` ${styles.hidden}`;
          }

          if (isCurrentLetter && isFlippingOut && isQuestionMark) {
            className += ` ${styles.flippingOut}`;
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
