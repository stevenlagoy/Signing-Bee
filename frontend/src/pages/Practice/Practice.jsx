import styles from "./Practice.module.scss";
import { useState } from "react";
import WebcamSample from "../../components/Camera/Camera";
import Dropdown from "../../components/Dropdown/Dropdown";
import Timer from "../../components/Timer/Timer";
import LetterReveal from "../../components/LetterReveal/LetterReveal";

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
        setDetectedLetter({
            letter,
            id: Date.now(),
        });
    };

    //button to start both timer and camera
    const startPractice = () => {
        setOneStart((prev) => prev + 1);
    };

    return (
        <div>
            <div className={styles.DIDContainer}>
                <Dropdown trigger="Leaderboard" className={styles.leaderboard}>
                    <p>Names Here</p>
                </Dropdown>
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

            <div className={styles.startRow}>
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