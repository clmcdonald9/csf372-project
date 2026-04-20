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
    username:"editor1",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
    fullName: "Editor One",
    role: "content editor",
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
    username: "manager1",
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    fullName: "Manager One",
    role: "manager",
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
    genre: "educational",
    views: 0,
    likes: 0,
    dislikes: 0,
    videoID: "bxIV_itPWkU",
    description: "a documentary about the mysteries of the pacific ocean",
    comments: [
      {
        username: "manager1",
        comment: "this is a comment from manager1"
      }
    ]
  },
  {
    title: "a plant documentary",
    genre: "educational",
    views: 0,
    likes: 0,
    dislikes: 0,
    videoID: "LWzUt5uoDV0",
    description: "a documentary about plants",
    comments: [
      {
        username: "manager1",
        comment: "this is a comment from manager1"
      },
      {
        username: "manager1",
        comment: "this is another comment from manager1"
      }
    ]
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
