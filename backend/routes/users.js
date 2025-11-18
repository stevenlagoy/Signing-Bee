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

//Login & signup
//obtain express
const express = require('express')

//controller functions
const {signupUser, loginUser} = require('../controllers/userController.js')

//login route 
router.post('/login', loginUser)

//signup route
router.post('/signup', signupUser)

export default router;