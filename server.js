
const path = require('path');
const express = require('express');
const app = express();
const { connectToDB, getDB } = require('./db')

const PORT = 3000;
const PUBLIC_DIRECTORY_PATH = path.join(__dirname, 'public');

app.use(express.static(PUBLIC_DIRECTORY_PATH));
app.use(express.json());

app.use('/Videos', express.static(path.join(__dirname, 'Videos')));

const authRouter = require('./routes/auth')
app.use('/auth', authRouter )

async function startServer() {
    await connectToDB();
    // API route for the Video Player.
    app.get('/api/movies/:title', async (req, res) => {
        try {
            const movieTitle = req.params.title;
            const db = getDB();

            const movieData = await db.collection("movies").findOne({ title: movieTitle });

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

    app.get("/", (req, res) => {
        res.sendFile(path.join(PUBLIC_DIRECTORY_PATH, "Login.html"));
    });

    app.listen(PORT, "0.0.0.0", () => {
        console.log('Server is up on port 3000');
    });
}

startServer();
