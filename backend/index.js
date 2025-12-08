import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from "./db/pool.js";
import textToSpeech from "@google-cloud/text-to-speech";
import dotenv from 'dotenv';

// Load env file from backend/env so running from project root still picks it up
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'env') });

const app = express();
// __dirname is available above
const frontendPath = path.join(__dirname, '../frontend/dist');

// Google Cloud Text-to-Speech Client
const client = new textToSpeech.TextToSpeechClient();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Test route
app.get(`/time`, async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ serverTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// USER ROUTES ------------------------------------------------------------------------------------

// Create a new user
app.post(`/users`, async (req, res) => {
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

// Login route - authenticate existing users
app.post(`/login`, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

  try {
    const result = await pool.query('SELECT id, username, password, created_at FROM "Users" WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });

    // Do not return the hashed password
    const { password: _pw, ...userSafe } = user;
    res.json(userSafe);

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to authenticate user' });

  }
});

// Get all users (without passwords)
app.get(`/users`, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, created_at FROM "Users"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user by id
app.get(`/users/:id`, async (req, res) => {
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
app.post(`/scores`, async (req, res) => {
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
app.get(`/scores`, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Score" ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Get scores for a specific user
app.get(`/scores/user/:userId`, async (req, res) => {
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
app.get(`/scores/user/:userId/high`, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT MAX(value) AS high_score FROM "Score" WHERE "user" = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch high score' });
  }
});

// Get audio file for speaking a word
app.post('/get-audio', async (req, res) => {
  const word = String(req.body.word || "").trim();
  if (!word) return res.status(400).send("Missing word");

  const [response] = await client.synthesizeSpeech({
    input: { text: word },
    voice: { languageCode: "en-US", name: "en-US-Neural2-A" },
    audioConfig: { audioEncoding: "MP3" },
  });

  res.setHeader("Content-Type", "audio/mpeg");
  res.send(response.audioContent); // this is the audio file bytes
});

app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// START SERVER -----------------------------------------------------------------------------------
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
