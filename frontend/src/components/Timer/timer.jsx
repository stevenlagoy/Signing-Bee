// Timer.jsx
// Signing Bee
// Harrison Niswander
// November 01, 2025

import styles from "./Timer.module.scss";
import { useState, useEffect, useRef } from 'react';

function Timer() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    //Start the timer
    const handleStartStop = () => {
        if (!isRunning) {
            setIsRunning(true);

            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 10);
            }, 10);

        }
        if(isRunning) {
            setIsRunning(false);
            clearInterval(intervalRef.current);
        }
    };

    const handleReset = () => {
        //reset time
        setTime(0);

        //stop time
        setIsRunning(false);
        clearInterval(intervalRef.current);
    }

    //clear 
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);
    
    // Format time for display
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor(time / 1000) % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return (
        <div className={styles.timerSpacing}>
            <h1>{formattedMinutes}:{formattedSeconds}</h1>
            <button className={styles.timerStartStop} onClick={handleStartStop}>{isRunning ? 'Stop' : time === 0 ? 'Start' : 'Resume'}</button>
            <button className={styles.timerReset} onClick={handleReset}>Reset</button>
        </div>
  );
}

export default Timer;