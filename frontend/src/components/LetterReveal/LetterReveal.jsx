import { useEffect, useState } from "react";
import styles from "./LetterReveal.module.scss";

export default function LetterReveal({ word, detectedLetter, onComplete }) {
  const [revealed, setRevealed] = useState([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [wrongLetter, setWrongLetter] = useState("");

  //reset when word changes
  useEffect(() => {
    setRevealed(Array.from(word).map(() => false));
    setLetterIndex(0);
    setWrongLetter("");
  }, [word]);

  //feedback for detected letters
  useEffect(() => {
    if (!detectedLetter) return;
    if (letterIndex >= word.length) return;

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
    }
  }, [detectedLetter, word, onComplete]);

  return (
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
  );
}