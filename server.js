
const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const { connectToDB } = require('./db')


const PORT = 3000;
const PUBLIC_DIRECTORY_PATH = path.join(__dirname, 'public');

app.use(session({
    secret: `secret-key-that-normally-should-be-in-env-but-i-think-its-
            fine-for-the-class-project-probably-and-also-i-think-he-said-
            we-didnt-even-need-to-use-sessions-but-i-think-it-will-make-some-
            things-easier`,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.static(PUBLIC_DIRECTORY_PATH));
app.use(express.json());

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
