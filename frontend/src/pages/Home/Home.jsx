import styles from "./Home.module.scss";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <section className={styles.home}>
                <h1>Welcome to Signing Bee!<img src="signing-bee-logo.svg" width="50" height="50" /></h1>
                <div>
                    <h2>Why learn ASL?</h2>
                    <p>
                        Up to 2 million Americans use sign language daily as their primary language, but
                        less than 3% of people in the US can understand ASL. On this site, you can play
                        interactive games which will teach the basics of ASL. You will learn and then
                        practice ASL signs and earn points for accurate, quick signing. You can also
                        compare your performance with other players on the leaderboard.
                    </p>
                </div>
                <div>
                    <h2>How to Play</h2>
                    <p>
                        There are several ways to learn ASL on Signing Bee! Start by going to
                        the <Link to="/asl-reference">ASL Reference page</Link> and learn to sign the
                        alphabet. You can turn on your camera to test your signing. Once you are
                        ready, go to the <Link to="/play">Play page</Link> and test out
                        signing letters to make words. 
                    </p>
                </div>
                <div>
                    <h2>Ready to Sign?</h2>
                    <Link to="/play">
                        <button>Click here to Play!</button>
                    </Link>
                </div>
                <div className={styles.images}>
                    <img src="signing2.png" alt="Close-up on womans hands showing sign language gesture with two index fingers pointing away from the signer." width="450" height="300" />
                    <img src="signing1.png" alt="Close-up on womans hand showing sign language gesture for &quot;I love you.&quot;" width="200" height="300" />
                    <img src="signing3.png" alt="Close-up on womans hands showing sign language gesture with cupped hands." width="450" height="300" />
                </div>
            </section>
        </>
    );
}