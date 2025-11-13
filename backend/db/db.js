import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'signing_bee_db',
    password: process.env.DB_PASSWORD || 'password',
    port : process.env.DB_PORT || 5432,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// Create database tables
pool.query(`
    -- Users core account info
    CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        user_firstname VARCHAR(255),
        user_lastname VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    -- Sessions / Tokens for persistent login
    CREATE TABLE IF NOT EXISTS sessions (
        session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- Audit log for signins
    CREATE TABLE IF NOT EXISTS auth_log (
        log_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
        action VARCHAR(50) NOT NULL, -- LOGIN_SUCCESS, LOGIN_FAIL
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- Scores to track user scores
    CREATE TABLE IF NOT EXISTS scores (
        score_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        points INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_scores_userid ON scores(user_id);
    CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at);

    CREATE OR REPLACE FUNCTION get_leaderboard(period TEXT, limit_count INT DEFAULT 10)
        RETURNS TABLE (
            username VARCHAR,
            total_points BIGINT
        ) AS $$
        BEGIN
            RETURN QUERY
            SELECT u.username, SUM(s.points) AS total_points
            FROM scores s
            JOIN users u on u.user_id = s.user_id
            WHERE (
                (period = 'week'  AND s.created_at >= NOW() - INTERVAL '7 days') OR
                (period = 'month' AND s.created_at >= date_trunc('month', NOW())) OR
                (period = 'year'  AND s.created_at >= date_trunc('year', NOW())) OR
                (period = 'all')
            )
            GROUP BY u.user_id, u.username
            ORDER BY total_points DESC
            LIMIT limit_count;
        END;
        $$ LANGUAGE plpgsql;
`).then(() => console.log('Database ready'))
  .catch(err => console.error('Error creating users table', err.stack));

export default pool;
