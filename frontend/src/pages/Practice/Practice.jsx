import React from "react";
import styles from "./Practice.module.scss";
import WebcamSample from "../../components/Camera/Camera";
import Dropdown from "../../components/Dropdown/Dropdown";
import Timer from "../../components/Timer/Timer";

export default function Practice() {
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

            <div>
                <Timer />
            </div>
            <WebcamSample />
        </div>
    );
}