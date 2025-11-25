import React from "react";
import styles from "./About.module.scss";
import CreatorProfileCard from "@/components/CreatorProfileCard";
import { creators } from "@/data/creators";

export default function About() {
    return (
        <div className={styles.about}>
            <h1>About this Project</h1>
            <div>
                <h2>What is Signing Bee?</h2>
                <p>
                    Signing Bee was made in Fall 2025 at Purdue University Fort Wayne as a
                    semester-long project for CS 347: Full-Stack Web Development. Signing Bee is a
                    learning platform designed to teach the basics of ASL spelling through an
                    interactive game platform.
                </p>
            </div>
            <div>
                <h2>Who made Signing Bee?</h2>
                <div className={styles.creatorsCards}>
                    {creators.map((creator) => (
                        <CreatorProfileCard
                            key={creator.name}
                            name={creator.name}
                            pictureSrc={creator.pictureSrc}
                        />
                    ))}
                </div>
            </div>
            <div>
                <h2>How did you make Signing Bee?</h2>
                <p>Signing Bee was made over the course of 16 weeks, starting with basic prototypes
                    of the gesture recgonition system, constructing a website around that, and then
                    connecting the page to other server-side services keep the leaderboard. The
                    technologies we used included:
                </p>
                <ul>
                    <li>Frontend: React</li>
                    <li>Backend: Node.js + Express</li>
                    <li>Database: PostgreSQL on Supabase</li>
                    <li>Testing: Cypress (E2E), Jest, Supertest</li>
                    <li>CI/CD: GitHub Actions</li>
                    <li>Hosting: Google Cloud platform</li>
                </ul>
            </div>
            <div>
                <h2>Where can I see more?</h2>
                <a href="https://github.com/stevenlagoy/Signing-Bee.git">Our GitHub Repository</a>
            </div>
        </div>
    );
}