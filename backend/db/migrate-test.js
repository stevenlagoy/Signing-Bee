import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'test',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'test_db',
  password: process.env.POSTGRES_PASSWORD || 'test',
  port: process.env.POSTGRES_PORT || 5432,
});

const migrate = async () => {
  try {
    console.log('Setting up test database schema...');
    await pool.query(`
      -- Drop existing tables
      DROP TABLE IF EXISTS sessions, auth_log, scores, users CASCADE;

      -- Create users table
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        user_firstname VARCHAR(255),
        user_lastname VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create sessions table
      CREATE TABLE sessions (
        session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create auth_log table
      CREATE TABLE auth_log (
        log_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
        action VARCHAR(50) NOT NULL,
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create scores table
      CREATE TABLE scores (
        score_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        points INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Test database schema setup complete.');
  } catch (err) {
    console.error('Error setting up test database schema:', err);
  } finally {
    await pool.end();
  }
};

migrate();