import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import cors from "cors";
import { pool } from "./db/pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

//routes
//const userRoutes = './routes/user.js';
//app.use('/api/user', userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Let React handle routing for any non-API request.
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
});

// USER ROUTES ------------------------------------------------------------------------------------

// Create a new user
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "Users" (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users (without passwords)
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, created_at FROM "Users"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user by id
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, username, created_at FROM "Users" WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// SCORE ROUTES -----------------------------------------------------------------------------------

// Create a new score
app.post('/scores', async (req, res) => {
  const { user, value } = req.body;
  if (!user || value === undefined) return res.status(400).json({ error: 'Missing user or value' });

  try {
    const result = await pool.query(
      'INSERT INTO "Score" ("user", value) VALUES ($1, $2) RETURNING *',
      [user, value]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create score' });
  }
});

// Get all scores
app.get('/scores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Score" ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Get scores for a specific user
app.get('/scores/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "Score" WHERE "user" = $1 ORDER BY value DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user scores' });
  }
});

// Get the high score for a user
app.get('/scores/user/:userId/high', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT MAX(value) AS high_score FROM "Score" WHERE "user" = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch high score' });
  }
});

// START SERVER -----------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
