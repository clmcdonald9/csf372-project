const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017"
const DBName = "SCProject"

const users = [
  {
    username: "admin1",
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // "password123"
    fullName: "Admin User",
    role: "admin",
    firstLogin: false,
    recoveryQuestions: [
    ]
  },
  {
    username:"editor1",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
    fullName: "Editor One",
    role: "content editor",
    firstLogin: false,
    recoveryQuestions: [
    ] 
  },
  {
    username: "manager1",
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    fullName: "Manager One",
    role: "marketing manager",
    firstLogin: false,
    recoveryQuestions: [
    ]
  },
  {
    username: "viewer1",
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    fullName: "Viewer One",
    role: "viewer",
    firstLogin: true,
    recoveryQuestions: [
    ]
  }
];

const movies = [
  {
    title: "The Greatest Mysteries of the Pacific Ocean",
    genre: "educational",
    videoID: "bxIV_itPWkU",
    description: "a documentary about the mysteries of the pacific ocean",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
    videoID: "LWzUt5uoDV0",
    description: "a documentary about plants",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Breath of The Wild Longplay",
    genre: "gaming",
    videoID: "0b0TNce_9tc",
    description: "~Zelda~",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Minecraft Cottage Building",
    genre: "gaming",
    videoID: "Dy3VtjcHdCs",
    description: "Minecraft wow yay",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "a spring garden documentary",
    genre: "educational",
    videoID: "_YhspVulqBg",
    description: "a documentary about plants",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "The Real Legends & Creatures of: Spirited Away",
    genre: "educational",
    videoID: "1ye0AQdYtd4",
    description: "a video going over the legends and creatures of spirited away.",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "The History of Bread",
    genre: "educational",
    videoID: "892yaBEwtbM",
    description: "a documentary about bread",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Bee and PuppyCat: Season 1",
    genre: "animation",
    videoID: "dop4MTlf_zc",
    description: "season 1 of bee and puppycat",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "FUNGI",
    genre: "educational",
    videoID: "KH9JVy-u5DQ",
    description: "a documentary about fungi",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Michael Reeves builds a catapult",
    genre: "educational",
    videoID: "oA85M9JHsW0",
    description: "Definitely educational",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Chronological History of Greek Mythology",
    genre: "educational",
    videoID: "fSKXDA11QA4",
    description: "whawhfkjalsdfkjlskdfjsldfjsaldf",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "How to Cut Fruit",
    genre: "educational",
    videoID: "VjINuQX4hbM",
    description: "Good luck",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Mariana Trench",
    genre: "educational",
    videoID: "qm-yxz6GijI",
    description: "a documentary about TRENCH",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Legally Blonde",
    genre: "comedy",
    videoID: "FS2ODDaGuZc",
    description: "Elle Woods has it all. She's the president of her sorority, a Hawaiian Tropic girl, Miss June in her campus calendar, and, above all, a natural blonde. She dates the cutest fraternity boy on campus and wants nothing more than to be Mrs. Warner Huntington III. But, there's just one thing stopping Warner from popping the question: Elle is too blonde. Growing up across the street form Aaron Spelling might mean something in LA, but nothing to Warner's East-Coast blue blood family. So, when Warner packs up for Harvard Law and reunites with an old sweetheart from prep school, Ellie rallies all her resources and gets into Harvard, determined to win him back. But law school is a far cry from the comforts of her poolside and the mall. Elle must wage the battle of her life, for her guy, for herself and for all blondes.",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Victorian Flower Language",
    genre: "educational",
    videoID: "oa-32Vyyp-w",
    description: "flower",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "How To Physics",
    genre: "educational",
    videoID: "ZAqIoDhornk",
    description: "I dont know how to physics, but good luck",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "How to Dogs",
    genre: "educational",
    videoID: "tuRl8moQbXU",
    description: "Dog",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
  },
  {
    title: "Bird Tier List",
    genre: "educational",
    videoID: "ZuVcOwXLnyQ",
    description: "What bird best bird?",
    views: 0,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
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
