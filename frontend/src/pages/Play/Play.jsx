import styles from "./Play.module.scss";
import WebcamSample from "../../components/Camera";
import Timer from "../../components/Timer";
import Leaderboard from "../../components/Leaderboard";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LetterReveal from "../../components/LetterReveal";
import Speaker from "../../components/Speaker";
import signingBeeRound from "../../services/signingBeeRound";
// import { useAuthContext } from "../../hooks/useAuthContext";

export default function Play() {
    // const { user } = useAuthContext();

    // // Redirect to login if not authenticated
    // if (!user) {
    //     return <Navigate to="/login" replace />;
    // }
    const [currentWord, setCurrentWord] = useState("");
    //most recent accepted letter
    const [detectedLetter, setDetectedLetter] = useState(null);
    //counter to trigger start
    const [oneStart, setOneStart] = useState(0);

    const nextWord = async () => {
        const newWord = await signingBeeRound.nextRound();
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

    const handleCorrectLetter = () => {
        setCorrectLetters((prev) => prev + 1);
    }

    //button to start both timer and camera
    const startPractice = async () => {
        setCorrectLetters(0);
        setElapsedSeconds(0);
        const word = await signingBeeRound.startRound();
        setCurrentWord(word);
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

    const handleFail = async () => {
        // Send score to leaderboard
        try {
            await fetch('/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: lettersPerMinute })
            });
        } catch (error) {
            console.error('Failed to submit score:', error);
        }

        // Start next round with new word
        await nextWord();
    };

    return (
        <div>
            <div className={styles.DIDContainer}>
                <Leaderboard />
                <div className={styles.introBox}>
                    <h1>Play</h1>
                    <p>
                        You will be shown a word and must sign each letter. You will earn more points for
                        faster signing! There is no time limit and you can play for as long as you want.
                    </p>
                </div>
                {/* <Dropdown trigger="Wiki" className={styles.wiki}>
                    <p>Iframe Here</p>
                </Dropdown> */}
            </div>
            <Timer oneStart={oneStart} />
            <div className={styles.speakerScore}>
                <div className={styles.speaker}>
                    <Speaker muted={muted} setMuted={setMuted} />
                </div>

                <div className={styles.scoreContainer}>
                    <span className={styles.scoreLabel}>Score</span>
                    <div className={styles.score}>{lettersPerMinute}</div>
                </div>
            </div>

            <div className={styles.startPractice}>
                <button onClick={startPractice}>Play</button>
            </div>

            <div>
                <LetterReveal
                    word={currentWord}
                    detectedLetter={detectedLetter}
                    onComplete={nextWord}
                    onFail={handleFail}
                    onCorrectLetter={handleCorrectLetter}
                />

            </div>

            <WebcamSample onLetterDetected={handleLetterDetected} oneStart={oneStart} />
        </div>
    );
}