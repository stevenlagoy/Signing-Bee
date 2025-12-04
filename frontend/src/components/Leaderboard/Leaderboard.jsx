import styles from './Leaderboard.module.scss';
import Dropdown from '../Dropdown';
import { useState, useEffect } from 'react';

export default function Leaderboard() {

    const [usersScores, setUsersScores] = useState([]);
    const numberLeaderboardEntries = 5;

    const API_BASE = import.meta.env.VITE_API_BASE || '/';

    useEffect(() => {
        const getUsers = async () => {
            const res = await fetch(`${API_BASE}/users`);
            if (!res.ok) {
                throw new Error(`Error fetching leaderboard: ${res.status}`);
            }
            const usersRes = await res.json();
            const temp = [];
            for (let u of usersRes) {
                const user = u;
                user.high_score = (await (await fetch(`http://localhost:4000/scores/user/${u.id}/high`)).json()).high_score;
                temp.push(user);
            }
            temp.sort(function (a, b) { return b.high_score - a.high_score });
            setUsersScores(temp.slice(0, numberLeaderboardEntries));
        }
        getUsers();
    }, []);

    useEffect(() => console.log(usersScores), [usersScores]);

    return (
        <Dropdown trigger="Leaderboard" className={styles.leaderboard}>
            <ol className={styles.leaderboard}>
                {usersScores.map((user, idx) => (
                    <LeaderboardEntry key={idx} name={user.username} score={user.high_score} />
                ))}
            </ol>
        </Dropdown>
    );
}

function LeaderboardEntry({name, score}) {
    return (
        <li className={styles.leaderboardEntry}>
            <h3 className={styles.name}>{name}</h3>
            <h3 className={styles.score}>Score: {score}</h3>
        </li>
    )
}