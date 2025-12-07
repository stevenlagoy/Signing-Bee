import React from "react";
import styles from "./Play.module.scss";
import WebcamSample from "../../components/Camera";
import Dropdown from "../../components/Dropdown";
import Timer from "../../components/Timer";
import Leaderboard from "../../components/Leaderboard";

export default function Play() {
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

            <div>
                <Timer />
            </div>
            <WebcamSample />
        </div>
    );
}