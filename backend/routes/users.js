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

export default router;