import React from "react";
import styles from "./Practice.module.scss";
import WebcamSample from "../../components/Camera";
import Dropdown from "../../components/Dropdown";
import Timer from "../../components/Timer";
import Leaderboard from "../../components/Leaderboard";
import { useState, useEffect } from "react";
import LetterReveal from "../../components/LetterReveal/LetterReveal";
import Speaker from "../../components/Speaker/Speaker";

const temp_words = ["ELDER", "APPLE", "DISH"]; //add more words here for now

export default function Practice() {
    //get random starting word
    const [currentWord, setCurrentWord] = useState(
        temp_words[Math.floor(Math.random() * temp_words.length)]
    );
    //most recent accepted letter
    const [detectedLetter, setDetectedLetter] = useState(null);
    //counter to trigger start
    const [oneStart, setOneStart] = useState(0);

    const nextWord = () => {
        let newWord = currentWord;

        //get random word with no consecutive repeats
        if (temp_words.length > 1) {
            while (newWord === currentWord) {
                newWord = temp_words[Math.floor(Math.random() * temp_words.length)];
            }
        }

        setCurrentWord(newWord);
        setDetectedLetter(null);
    };

    //makes each letter added unique to prevent immediate reuse into next letter
    const handleLetterDetected = (letter) => {
        setCorrectLetters((prev) => prev + 1);
        setDetectedLetter({
            letter,
            id: Date.now(),
        });
    };

    //button to start both timer and camera
    const startPractice = () => {
        setCorrectLetters(0);
        setElapsedSeconds(0);
        setOneStart((prev) => prev + 1);
    };

    const [muted, setMuted] = useState(false);
    const [correctLetters, setCorrectLetters] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        const media = document.querySelectorAll("audio, video");
        media.forEach((AVElement) => {
            AVElement.muted = muted;
        });
    }, [muted]);

    useEffect(() => {
        if (oneStart === 0) return;

        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [oneStart]);

    const minutes = elapsedSeconds / 60;
    const lettersPerMinute =
        minutes > 0 ? Math.round(correctLetters / minutes) : 0;

    return (
        <div>
            <div className={styles.DIDContainer}>
                <Leaderboard />
                <div className={styles.introBox}>
                    <h1>Practice Mode</h1>
                    <p>
                        You will be shown a word and must sign each letter. You will earn more points for
                        faster signing! There is no time limit and you can practice for as long as you want.
                    </p>
                </div>
                <Dropdown trigger="Wiki" className={styles.wiki}>
                    <p>Iframe Here</p>
                </Dropdown>
            </div>

            <div className={styles.speakerScore}>
                <div className={styles.speaker}>
                    <Speaker muted={muted} setMuted={setMuted}/>
                </div>
                
                <div className={styles.scoreContainer}>
                    <span className={styles.scoreLabel}>Score</span>
                    <div className={styles.score}>{lettersPerMinute}</div>
                </div>
            </div>

            <div className={styles.startPractice}>
                <button onClick={startPractice}>Start Practice</button>
            </div>

            <div>
                <LetterReveal
                    word={currentWord}
                    detectedLetter={detectedLetter}
                    onComplete={nextWord}
                />
                <Timer oneStart={oneStart}/>
            </div>

            <WebcamSample onLetterDetected={handleLetterDetected} oneStart={oneStart} />
        </div>
    );
}