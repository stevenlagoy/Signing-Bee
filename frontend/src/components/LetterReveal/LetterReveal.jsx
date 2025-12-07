import { useEffect, useState, useRef } from "react";
import styles from "./LetterReveal.module.scss";

//swap audio here if we want different sounds
const audioCorrect = new Audio("/correct.mp3");
const audioWrong = new Audio("/wrong.mp3");

export default function LetterReveal({ word, detectedLetter, onComplete, onCorrectLetter }) {
  const [revealed, setRevealed] = useState([]);
  const [letterIndex, setLetterIndex] = useState(0);
  const [wrongLetter, setWrongLetter] = useState("");
  const [isComplete, setIsComplete] = useState(false); 
  const [isFlippingOut, setIsFlippingOut] = useState(false); 
  const lastID = useRef(null);
  const isPaused = useRef(false);

  //reset when word changes
  useEffect(() => {
    setRevealed(Array.from(word).map(() => false));
    setLetterIndex(0);
    setWrongLetter("");
    setIsComplete(false);
    setIsFlippingOut(false);
    isPaused.current = false;
    lastID.current = null;
  }, [word]);

  //incoming letters
  useEffect(() => {
    if (!detectedLetter) return;
    if (letterIndex >= word.length) return;
    if (isComplete || isFlippingOut) return;
    
    //pause a moment to not immediately reprocess same letter
    if (detectedLetter.id === lastID.current) return;
    if (isPaused.current) return;

    const inputLetter = detectedLetter.letter;
    if (!inputLetter) return;

    const expected = word[letterIndex].toUpperCase();
    const inputLetterCaps = inputLetter.toUpperCase();

    if (inputLetterCaps === expected) {
      lastID.current = detectedLetter.id;

      if (onCorrectLetter) {
        onCorrectLetter();
      }

      audioCorrect.currentTime = 0;
      audioCorrect.play().catch((e) => console.log("Audio play failed", e));
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

    } else {
      lastID.current = detectedLetter.id; 

      audioWrong.currentTime = 0;
      audioWrong.play().catch((e) => console.log("Audio play failed", e));
      setWrongLetter(inputLetterCaps);
    }
  }, [detectedLetter, word, onComplete, letterIndex, isComplete, isFlippingOut, onCorrectLetter]);

  return (
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
  );
}