const { MongoClient } = require('mongodb');
const path = require('path');
const express = require('express');
const app = express();

const port = 3000;
const publicDirPath = path.join(__dirname, 'public');

const url = "mongodb://localHost:27017";
const DBName = "SCProject";

const client = new MongoClient(url);

async function connectToDB() {
    try {
        await client.connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDB();

app.use(express.static(publicDirPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicDirPath, "Home.html"));
});

app.listen(port, "0.0.0.0", () => {
    console.log('Server is up on port 3000');
});