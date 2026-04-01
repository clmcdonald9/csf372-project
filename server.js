const path = require('path');
const express = require('express');
const app = express();

const publicDirPath = path.join(__dirname, 'public');

app.use(express.static(publicDirPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicDirPath, "Home.html"));
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});