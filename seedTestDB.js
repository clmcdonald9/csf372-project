const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localHost:27017"
const DBName = "SCProject"

const users = [
  {
    username: "admin1",
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // "Password123!"
    fullName: "Admin User",
    role: "admin",
    firstLogin: true,
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
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    fullName: "Viewer One",
    role: "viewer",
    firstLogin: true,
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
    title: "The Greatest Mysteries of the Pacific Ocean",
    genre: "documentary",
    releaseDate: 2024,
    views: 0,
    likes: 0,
    dislikes: 0,
    videoPath: "https://www.youtube.com/watch?v=bxIV_itPWkU",
    videoID: "bxIV_itPWkU"
  },
  {
    title: "a plant documentary",
    genre: "documentary",
    releaseDate: 2023,
    views: 0,
    likes: 0,
    dislikes: 0,
    videoPath: "https://www.youtube.com/watch?v=LWzUt5uoDV0",
    videoID: "LWzUt5uoDV0"
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
