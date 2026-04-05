const express = require('express');
const router = express.Router();
const { getDB } = require ('../db')

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    
    try {
        const user = await db.collection('users').findOne({ username, password });

        console.log("Login attempt:", { username, password });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        res.json({ success: true, message: 'Login successful', user: { username: user.username, fullName: user.fullName, role: user.role } });
    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

module.exports = router