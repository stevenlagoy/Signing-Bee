import { Router } from "express";
import db from "../db/db.js";

const router = Router();

router.get('/init-db', async (req, res) => {
    try {
        await db.query('SELECT NOW()');
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;