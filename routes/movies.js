const express = require('express');
const { getDB } = require ('../db');
const router = express.Router();

router.get('/all-movies', async (req, res) => {
    const db = getDB();

    try {
        
        const movies = await db.collection('movies').find({}).toArray();
        res.json(movies);

    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'An error occurred while fetching movies' });
    }
});

module.exports = router;