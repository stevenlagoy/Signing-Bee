import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <section>
                <h1>Welcome to Signing Bee!</h1>
                <h2>Why learn ASL?</h2>
                <p>
                    Up to 2 million Americans use sign language daily as their primary language, but
                    less than 3% of people in the US can understand ASL. On this site, you can play
                    interactive games which will teach the basics of ASL. You will learn and then
                    practice ASL signs and earn points for accurate, quick signing. You can also
                    compare your performance with other players on the leaderboard.
                </p>
                <h2>How to Play</h2>
                <p>
                    There are several ways to learn ASL on Signing Bee!
                </p>

                <h2>Ready to Play?</h2>
                <Link to="/practice">
                    <p>Click here to enter Practice Mode</p>
                </Link>
            </section>
        </>
    );
}