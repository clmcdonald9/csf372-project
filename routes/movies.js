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
        dislikes: 0,
        ratedBy: [],
        comments: []
    };

    try {
        await db.collection('movies').insertOne(newMovie);
        res.status(201).json({ message: 'Movie added successfully' });
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ message: 'An error occurred while adding the movie' });
    }
});

router.post('/:movieID/comment', async (req, res) => {
    const db = getDB();
    const { text } = req.body;
    const { movieID } = req.params;

    if (!text || !movieID) {
        return res.status(400).json({ message: 'Comment text and movieID are required' });
    }

    const newComment = {
        username: req.session.user.username,
        comment: text
    };

    try {
        await db.collection('movies').updateOne(
            { videoID: movieID },
            { $push: { comments: newComment } }
        );

        const updatedMovie = await db.collection('movies').findOne({ videoID: movieID });

        res.status(201).json({ success: true, comments: updatedMovie.comments });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: 'An error occurred while adding the comment' });
    }
});

router.post('/:movieID/like', async (req, res) => {
    try {
        const db = getDB();
        const { movieID } = req.params;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
        }

        const movie = await db.collection('movies').findOne({ videoID: movieID });

        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        const alreadyLiked = movie.ratedBy.includes(req.session.user.username);

        const updateLikes = await db.collection('movies').updateOne(
            { videoID: movieID },
            alreadyLiked 
            ? { $inc: { likes: -1 }, $pull: { ratedBy: req.session.user.username } }
            : { $inc: { likes: 1 }, $push: { ratedBy: req.session.user.username } }
        );

        if (updateLikes.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Movie not found and likes not updated' });
        }

        const result = await db.collection('movies').findOne({ videoID: movieID }, { projection: { likes: 1, _id: 0} });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Movie and likes not found' });
        }

        res.status(200).json({ success: true, likes: result.likes });
    } catch (error) {
        console.error('Error liking movie:', error);
        res.status(500).json({ success: false, message: 'An error occurred while liking the movie' });

    }
});

router.post('/:movieID/dislike', async (req, res) => {
    try {
        const db = getDB();
        const { movieID } = req.params;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
        }

        const movie = await db.collection('movies').findOne({ videoID: movieID });

        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        const alreadyDisliked = movie.ratedBy.includes(req.session.user.username);

        const updateDislikes = await db.collection('movies').updateOne(
            { videoID: movieID },
            alreadyDisliked 
            ? { $inc: { dislikes: 1 }, $pull: { ratedBy: req.session.user.username } }
            : { $inc: { dislikes: 1 }, $push: { ratedBy: req.session.user.username } }
        );

        if (updateDislikes.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Movie not found and dislikes not updated' });
        }

        const result = await db.collection('movies').findOne({ videoID: movieID }, { projection: { dislikes: 1, _id: 0} });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Movie and dislikes not found' });
        }

        res.status(200).json({ success: true, dislikes: result.dislikes });
    } catch (error) {
        console.error('Error disliking movie:', error);
        res.status(500).json({ success: false, message: 'An error occurred while disliking the movie' });
    }
});

router.get('/:movieID', async (req, res) => {
    try {
        const movieID = req.params.movieID;
        const db = getDB();

        const movieData = await db.collection("movies").findOne({ videoID: movieID });

        if (!movieData) {
            res.status(404).json({ success: false, message: "Movie not found" });
            return;
        }

        res.status(200).json({ success: true, movie: movieData });
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;