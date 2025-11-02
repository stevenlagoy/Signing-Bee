//Harrison Niswander
//Signing Bee
//11-1-25
//timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import styles from "./timer.module.scss";

// keeps track of seconds
let c=1;

function timer() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const [sec, setSec] = useState(0);
    const [buttonText, setButtonText] = useState('Start');

    //Start the timer
    const handleStartStop = () => {
        if (!isRunning) 
        {
            setIsRunning(true);
            //setIsRunning2(true);

            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 10);
            }, 10); // seconds

            setButtonText('Stop');
        }

        if(isRunning)
        {
            setIsRunning(false);
            clearInterval(intervalRef.current);

            setButtonText('Resume');
        }
    };

    const handleReset = () =>
    {
        //reset time
        setTime(prevTime => 0);
        setSec(0);
        c = 1;

        //stop time
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setButtonText('Start');

    }

    //clear 
    useEffect(() => {
        return () => {
        clearInterval(intervalRef.current);
        };
    }, []);
    

    // Format time for display
    let seconds = Math.floor(time / 60000);
    let millisecond = Math.floor((time % 60000) / 10);

    if (millisecond >= 100*c) {
        millisecond = millisecond % 100;
        setSec(prev => prev + 1);

        c++;
    }
        
    millisecond = millisecond % 100;

    let formattedSeconds = String(sec).padStart(2, '0');
    let formattedMilliseconds = String(millisecond).padStart(2, '0');

    return (
        <div className={styles.timerSpacing}>
            <h1>{formattedSeconds}.{formattedMilliseconds}</h1>
            <button className={styles.timerStartStop} onClick={handleStartStop}>{buttonText}</button>
            <button className={styles.timerReset} onClick={handleReset}>Reset</button>
        </div>
  );
}

export default timer;