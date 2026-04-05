const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const DBName = "SCProject";

let db;

async function connectToDB() {
    try {
        await client.connect();
        db = client.db(DBName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

function getDB() {
    return db;
}

module.exports = { connectToDB, getDB }