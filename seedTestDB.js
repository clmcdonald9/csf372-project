const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localHost:27017"
const DBName = "SCProject"

const users = [
  {
    username: "admin1",
    password: "password123",
    fullName: "Admin User",
    role: "admin",
    recoveryQuestions: [
      {
        question: "what is 2 + 2?",
        answer: "4"
      },
      {
        question: "what is the square root of 16",
        answer: "4"
      }
    ]
  },
  {
    username: "viewer1",
    password: "password123",
    fullName: "Viewer One",
    role: "viewer",
    recoveryQuestions: [
      {
        question: "what is 2 + 2?",
        answer: "4"
      },
      {
        question: "what is the square root of 16",
        answer: "4"
      }
    ]
  }
];

const movies = [
  {
    title: "movie1",
    genre: "Adventure",
    releaseDate: 2024,
    views: 0,
    likes: 0
  },
  {
    title: "movie2",
    genre: "Sci-Fi",
    releaseDate: 2023,
    views: 0,
    likes: 0
  }
];

async function seedTestDB() {
  const client = new mongoClient(url);
  try {
    await client.connect(url);
    console.log("connected to MongoDB")

    const db = client.db(DBName);

    await db.collection("users").deleteMany({});
    await db.collection("movies").deleteMany({});

    await db.collection("users").insertMany(users);
    await db.collection("movies").insertMany(movies);

    console.log("seed successful");

  }
  catch (error) {
    console.error("seed failed: ", error);
  }
  finally {
    await client.close();
    console.log("connection closed")
  }
}

seedTestDB();
