import styles from "./Play.module.scss";
import WebcamSample from "../../components/Camera";
import Timer from "../../components/Timer";
import Leaderboard from "../../components/Leaderboard";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LetterReveal from "../../components/LetterReveal";
import Speaker from "../../components/Speaker";
import signingBeeRound from "../../services/signingBeeRound";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Play() {
    const { user } = useAuthContext();

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }
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
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const media = document.querySelectorAll("audio, video");
        media.forEach((AVElement) => {
            AVElement.muted = muted;
        });
    }, [muted]);

    useEffect(() => {
        if (oneStart === 0 || isPaused) return;

        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [oneStart, isPaused]);

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

    const togglePause = () => {
        if (oneStart === 0) return; // Don't allow pause before game starts
        setIsPaused(prev => !prev);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topSection}>
                <Leaderboard />
                <div className={styles.centerContent}>
                    <h1 className={styles.pageTitle}>Play</h1>
                    <p className={styles.description}>
                        You will be shown a word and must sign each letter. You will earn more points for
                        faster signing! There is no time limit and you can play for as long as you want.
                    </p>
                </div>
                {oneStart === 0 && (
                    <div className={styles.instructions}>
                        <h3>How to Play:</h3>
                        <ul>
                            <li>Click "Play" to start</li>
                            <li>Sign each letter using ASL</li>
                            <li>Hold signs clearly for recognition</li>
                            <li>Complete words to earn points</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className={styles.statsBar}>
                <Timer oneStart={oneStart} isPaused={isPaused} />
                <div className={styles.scoreContainer}>
                    <span className={styles.scoreLabel}>Score</span>
                    <div className={styles.score}>{lettersPerMinute}</div>
                </div>
            </div>

            <div className={styles.controlsBar}>
                <Speaker muted={muted} setMuted={setMuted} />
                <button onClick={startPractice} className={styles.playButton}>Play</button>
                {oneStart > 0 && (
                    <button onClick={togglePause} className={styles.pauseButton}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                )}
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

            <div className={styles.cameraSection}>
                {oneStart === 0 && (
                    <div className={styles.readyPrompt}>
                        <div className={styles.readyIcon}>📹</div>
                        <h2>Ready to Sign?</h2>
                        <p>Make sure your camera is positioned properly and you have good lighting.</p>
                        <p>Click the Play button above to begin!</p>
                    </div>
                )}

                {!isPaused && oneStart > 0 && (
                    <WebcamSample onLetterDetected={handleLetterDetected} oneStart={oneStart} />
                )}
            </div>
        </div>
    );
}