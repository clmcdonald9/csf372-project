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

router.post('/add-movie', async (req, res) => {
    const db = getDB();
    const { title, genre, videoID, description } = req.body;

    if (!title || !genre || !videoID) {
        return res.status(400).json({ message: 'Title, genre, videoID, and description are required' });
    }

    const newMovie = {
        title,
        genre,
        videoID,
        description,
        views: 0,
        likes: 0,
        dislikes: 0
    };

    try {
        await db.collection('movies').insertOne(newMovie);
        res.status(201).json({ message: 'Movie added successfully' });
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ message: 'An error occurred while adding the movie' });
    }
});

module.exports = router;