import React from "react";
import styles from "./About.module.scss";
import CreatorProfileCard from "@/components/CreatorProfileCard/CreatorProfileCard";
import { creators } from "@/data/creators";

export default function About() {
    return (
        <>
            <h1>About this Project</h1>
            <h2>What is Signing Bee?</h2>
            <p>
                Signing Bee was made in Fall 2025 at Purdue University Fort Wayne as a
                semester-long project for CS 347: Full-Stack Web Development. Signing Bee is a
                learning platform designed to teach the basics of ASL spelling through an
                interactive game platform.
            </p>
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
            <h2>What did you use to make Signing Bee?</h2>
            <ul>
                <li>Frontend: React</li>
                <li>Backend: Node.js + Express</li>
                <li>Database: PostgreSQL</li>
                <li>Testing: Cypress (E2E), Jest, Supertest, GitHub Actions (CI/CD)</li>
            </ul>
            <h2>Where can I see more?</h2>
            <a href="https://github.com/stevenlagoy/Signing-Bee.git">Our GitHub Repository</a>
        </>
    );
}