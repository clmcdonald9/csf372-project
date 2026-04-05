const { MongoClient } = require('mongodb');
const path = require('path');
const express = require('express');
const app = express();

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const DBName = "SCProject";
const db=client.db(DBName);

const port = 3000;
const publicDirPath = path.join(__dirname, 'public');

app.use(express.static(publicDirPath));
app.use(express.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
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

async function connectToDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function startServer() {

    await connectToDB();

    app.get("/", (req, res) => {
        res.sendFile(path.join(publicDirPath, "Home.html"));
    });

    app.listen(port, "0.0.0.0", () => {
        console.log('Server is up on port 3000');
    });
}

startServer();
