
const path = require('path');
const express = require('express');
const app = express();
const { connectToDB } = require('./db')

const PORT = 3000;
const PUBLIC_DIRECTORY_PATH = path.join(__dirname, 'public');

app.use(express.static(PUBLIC_DIRECTORY_PATH));
app.use(express.json());

app.use('/Videos', express.static(path.join(__dirname, 'Videos')));

const authRouter = require('./routes/auth')
app.use('/auth', authRouter )

async function startServer() {

    await connectToDB();

    app.get("/", (req, res) => {
        res.sendFile(path.join(PUBLIC_DIRECTORY_PATH, "Login.html"));
    });

    app.listen(PORT, "0.0.0.0", () => {
        console.log('Server is up on port 3000');
    });
}

startServer();
