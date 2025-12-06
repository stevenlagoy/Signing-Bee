import { useEffect, useRef } from "react";
import styles from "./Practice.module.scss";
import WebcamSample from "../../components/Camera";
import Dropdown from "../../components/Dropdown";
import Timer from "../../components/Timer";
import Leaderboard from "../../components/Leaderboard";
import Speaker from "../../components/Speaker/Speaker";
import signingBeeRound from "../../services/signingBeeRound";

export default function Practice() {
    const hasStarted = useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        signingBeeRound.startRound({ difficulty: 'easy', speak: true });
    }, []);

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

            <div>
                <Timer />
            </div>
            <Speaker />
            <WebcamSample />
        </div>
    );
}
