
const path = require('path');
const express = require('express');
const app = express();
const { connectToDB } = require('./db')

const port = 3000;
const publicDirPath = path.join(__dirname, 'public');

app.use(express.static(publicDirPath));
app.use(express.json());

const authRouter = require('./routes/auth')
app.use('/auth', authRouter )

async function startServer() {

    await connectToDB();

    app.get("/", (req, res) => {
        res.sendFile(path.join(publicDirPath, "Login.html"));
    });

    app.listen(port, "0.0.0.0", () => {
        console.log('Server is up on port 3000');
    });
}

startServer();
