import request from 'supertest';
import bcrypt from 'bcrypt';
import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

// --- Set up test server ---
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(express.json());

// --- Routes to test (simplified for testing) ---
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO "Users" (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
    [username, hashedPassword]
  );
  res.json(result.rows[0]);
});

app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT id, username, created_at FROM "Users"');
  res.json(result.rows);
});

app.post('/scores', async (req, res) => {
  const { user, value } = req.body;
  const result = await pool.query(
    'INSERT INTO "Score" ("user", value) VALUES ($1, $2) RETURNING *',
    [user, value]
  );
  res.json(result.rows[0]);
});

app.get('/scores/user/:userId/high', async (req, res) => {
  const { userId } = req.params;
  const result = await pool.query('SELECT MAX(value) AS high_score FROM "Score" WHERE "user" = $1', [userId]);
  res.json(result.rows[0]);
});

// --- Tests ---
describe('Backend API', () => {
  let testUserId;

  test('Create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('testuser');
    testUserId = res.body.id;
  });

  test('Get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Create a score for user', async () => {
    const res = await request(app)
      .post('/scores')
      .send({ user: testUserId, value: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body.value).toBe(200);
    expect(res.body.user).toBe(testUserId);
  });

  test('Get high score for user', async () => {
    const res = await request(app).get(`/scores/user/${testUserId}/high`);
    expect(res.statusCode).toBe(200);
    expect(res.body.high_score).toBeGreaterThanOrEqual(0);
  });
  
  afterAll(async () => {
    if (testUserId) {
      await pool.query('DELETE FROM "Score" WHERE "user" = $1', [testUserId]);
      await pool.query('DELETE FROM "Users" WHERE id = $1', [testUserId]);
    }
    await pool.end();
  });
});
