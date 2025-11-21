import { Router } from 'express';
import db from '../db/db.js';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get one user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /users/:id error:', err.message);
    res.status(500).send('Server error');
  }
});

// Create a user
router.post('/', async (req, res) => {
  try {
    const { email, username, password_hash, user_firstname, user_lastname } = req.body;

    const result = await db.query(
      `
      INSERT INTO users (email, username, password_hash, user_firstname, user_lastname)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [email, username, password_hash, user_firstname, user_lastname]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /users error:', err.message);
    res.status(500).send('Server error');
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['email', 'username', 'password_hash', 'user_firstname', 'user_lastname'];

    // Build dynamic SET clause for partial updates
    const updates = [];
    const values = [];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        values.push(req.body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    values.push(id);

    const result = await db.query(
      `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE user_id = $${values.length}
      RETURNING *;
      `,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /users/:id error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    console.error('DELETE /users/:id error:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;