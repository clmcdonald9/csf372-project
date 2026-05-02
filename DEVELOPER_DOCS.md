Now I have all the source code I need. Here is the complete **Developer Documentation** for `clmcdonald9/csf372-project`:

---

# Developer Documentation
## CSF372 Project — Movie Streaming Web Application

**Repository:** https://github.com/clmcdonald9/csf372-project
**Stack:** Node.js · Express 5 · MongoDB · Vanilla JS/HTML (Client-side)

---

## 1. Introduction to the Product Source Code

### 1a. Module Diagram & Information Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │ Login.js │  │Gallery.js│  │VideoPlayer  │  │  AddMovie.js   │  │
│  │          │  │          │  │   .js       │  │                │  │
│  └────┬─────┘  └────┬─────┘  └──────┬──────┘  └───────┬────────┘  │
│       │             │               │                  │           │
│  ┌────┴─────┐  ┌────┴───────────────┴──────────────────┴───────┐   │
│  │NewUser.js│  │             PasswordReset.js                  │   │
│  └────┬─────┘  └────────────────────────────────────────────────┘   │
└───────┼──────────────────────────────────────────────────────────────┘
        │  HTTP Fetch API (JSON over REST)
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js / Express)                   │
│                                                                     │
│  ┌───────────────────────┐      ┌──────────────────────────────┐   │
│  │     server.js         │      │         db.js                │   │
│  │  (Entry point,        │──────│  (MongoDB connection pool)   │   │
│  │   middleware, routes) │      └──────────────┬───────────────┘   │
│  └───────┬───────────────┘                     │                   │
│          │                                     │                   │
│  ┌───────┴──────────┐   ┌─────────────────┐    │                   │
│  │  routes/auth.js  │   │ routes/movies.js│────┘                   │
│  │  POST /auth/*    │   │ GET|POST|PUT     │                        │
│  │  (login, logout, │   │ DELETE /movies/* │                        │
│  │  pwd reset,      │   │ (CRUD + like/    │                        │
│  │  account setup)  │   │  dislike/comment)│                        │
│  └──────────────────┘   └─────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MongoDB  ("SCProject" database)                 │
│                                                                     │
│   ┌─────────────────────┐        ┌──────────────────────────┐      │
│   │   "users" collection│        │   "movies" collection    │      │
│   │  username, password │        │  title, genre, videoID,  │      │
│   │  role, firstLogin,  │        │  description, views,     │      │
│   │  recoveryQuestions  │        │  likes, dislikes,        │      │
│   └─────────────────────┘        │  likedBy, dislikedBy,    │      │
│                                  │  comments[]              │      │
│                                  └──────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

**Information Flow Summary:**
1. The browser client sends HTTP `fetch()` requests (JSON) to the Express server.
2. `server.js` bootstraps the app, connects to MongoDB via `db.js`, and mounts route handlers.
3. `routes/auth.js` handles all user identity operations; `routes/movies.js` handles all movie data operations.
4. Both route modules call `getDB()` from `db.js` to perform MongoDB queries.
5. Responses (JSON) are returned to the client, which updates the DOM accordingly.

---

### 1b. Module-to-Source-File Mapping

| Module | Source File(s) | Role |
|---|---|---|
| **Server Entry Point** | `server.js` | Bootstraps Express app, mounts middleware and routes, starts HTTP listener |
| **Database Connector** | `db.js` | Manages MongoDB connection; exports `connectToDB()` and `getDB()` |
| **Authentication API** | `routes/auth.js` | REST endpoints for login, logout, session check, security questions, password reset, first-login account setup |
| **Movies API** | `routes/movies.js` | REST endpoints for CRUD on movies, likes/dislikes, comments |
| **Login Page** | `public/Login.html` + `public/Login.js` | User login form and submission logic |
| **New User Setup Page** | `public/NewUser.html` + `public/NewUser.js` | First-login account setup (security questions + new password) |
| **Password Reset Page** | `public/PasswordReset.html` + `public/PasswordReset.js` | Self-service password reset via security questions |
| **Movie Gallery Page** | `public/Gallery.html` + `public/Gallery.js` | Displays all movies as a browseable thumbnail grid |
| **Video Player Page** | `public/VideoPlayer.html` + `public/VideoPlayer.js` | Embeds YouTube player, shows metadata, handles likes/dislikes/comments, role-gated edit/delete |
| **Add/Edit Movie Page** | `public/AddMovie.html` + `public/AddMovie.js` | Form for adding a new movie or editing an existing one (admin/content editor only) |
| **Database Seeder** | `seedTestDB.js` | Populates MongoDB with test users and movies for development/testing |

---

## 2. Major Functions in Each Module

---

### Module: `db.js`

#### `connectToDB()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` — resolves when connected; logs error on failure |
| **Overview** | Creates a `MongoClient` connection to `mongodb://localhost:27017` and stores the `SCProject` database handle in the module-scoped `db` variable. Called once at server startup from `server.js`. |

#### `getDB()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Db` — the active MongoDB database instance |
| **Overview** | Simple getter that returns the cached `db` variable. All route handlers call this to obtain the database handle without managing their own connections. |

---

### Module: `server.js`

#### `startServer()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Async entry-point function. Awaits `connectToDB()`, then registers the `GET /` route (serves `Login.html`), and starts the HTTP listener on port 3000 on all interfaces (`0.0.0.0`). Express middleware (`express-session`, `express.static`, `express.json`, and static `/Videos` serving) is configured at module scope before this function runs. |

---

### Module: `routes/auth.js`

#### `POST /auth/login`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.body: { username: string, password: string }` |
| **Returns** | JSON `{ success, message, user: { username, fullName, role, firstLogin } }` |
| **Overview** | Hashes the supplied password with SHA-256 (`js-sha256`), queries the `users` collection for a matching `username` + `password` pair. On success, stores `{ id, username, fullName, role }` in `req.session.user` and returns user data. Returns HTTP 401 on bad credentials, 500 on DB error. |

#### `POST /auth/user`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads `req.session`) |
| **Returns** | JSON `{ loggedIn: boolean, user? }` |
| **Overview** | Checks whether a session exists. Returns `{ loggedIn: true, user }` if a session is active, otherwise `{ loggedIn: false }`. Used by every front-end page to guard access. |

#### `POST /auth/logout`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | JSON `{ success: boolean }` |
| **Overview** | Calls `req.session.destroy()` to invalidate the current session. Returns 500 on failure. |

#### `POST /auth/security-questions`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.body: { username: string }` |
| **Returns** | JSON `{ success, questions: [{ question }] }` |
| **Overview** | Looks up the user by username and returns the text of their two recovery questions (without answers). Returns 404 if user not found. Used by the Password Reset flow to populate question labels. |

#### `POST /auth/update-password`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.body: { username, answer1, answer2, newPassword }` |
| **Returns** | JSON `{ success, message }` |
| **Overview** | Hashes both answers and the new password. Fetches the user, compares hashed answers against stored values. If correct, updates `password` in MongoDB with `$set`. Returns 401 on wrong answers, 404 if user not found. |

#### `POST /auth/update-user-account`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.body: { username, question1, question2, answer1, answer2, newPassword }` |
| **Returns** | JSON `{ success, message }` |
| **Overview** | Called on first login. Hashes the new password and both security answers, then uses `$set` to update `password`, `recoveryQuestions`, and sets `firstLogin: false` on the user document. |

---

### Module: `routes/movies.js`

#### `GET /movies/all-movies`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | JSON array of all movie documents |
| **Overview** | Calls `find({}).toArray()` on the `movies` collection and returns the full list. Used by the Gallery page to render movie cards. |

#### `POST /movies/add-movie`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.body: { title, genre, videoID, description }` |
| **Returns** | JSON `{ message }`, HTTP 201 on success |
| **Overview** | Validates required fields, constructs a new movie document with default counters (`views: 0, likes: 0, dislikes: 0, likedBy: [], dislikedBy: [], comments: []`), and inserts it into the `movies` collection. |

#### `PUT /movies/update-movie/:movieID`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.params.movieID: string`; `req.body: { title, genre, description }` |
| **Returns** | JSON `{ message }`, HTTP 200 on success |
| **Overview** | Validates that title and genre are present, then performs `updateOne({ videoID: movieID }, { $set: { title, genre, description } })`. Returns 404 if no matching document. |

#### `DELETE /movies/delete/:movieID`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.params.movieID: string` |
| **Returns** | JSON `{ message }`, HTTP 200 on success |
| **Overview** | Calls `deleteOne({ videoID: movieID })`. Returns 404 if no document was deleted. |

#### `POST /movies/:movieID/comment`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.params.movieID: string`; `req.body: { text: string }` |
| **Returns** | JSON `{ success, comments[] }`, HTTP 201 |
| **Overview** | Builds a `{ username, comment }` object using `req.session.user.username`, pushes it to the movie's `comments` array with `$push`, re-fetches the movie, and returns the updated comments list for immediate DOM re-render. |

#### `POST /movies/:movieID/like`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.params.movieID: string`; requires active session |
| **Returns** | JSON `{ success, liked: boolean, likes, dislikes }` |
| **Overview** | Implements a toggle-like system. Checks if the session user is already in `likedBy` or `dislikedBy`. If already liked → removes the like. If previously disliked → switches to liked. Otherwise → adds a like. Uses `$inc`, `$pull`, and `$addToSet` operators atomically. |

#### `POST /movies/:movieID/dislike`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.params.movieID: string`; requires active session |
| **Returns** | JSON `{ success, disliked: boolean, likes, dislikes }` |
| **Overview** | Mirror of the `like` handler. Toggle-dislike logic: removes dislike if already disliked, switches from liked to disliked if previously liked, otherwise adds a dislike. |

#### `GET /movies/:movieID`
| Attribute | Detail |
|---|---|
| **Parameters** | `req.params.movieID: string` |
| **Returns** | JSON `{ success, userLiked: boolean, userDisliked: boolean, movie }` |
| **Overview** | Fetches a single movie document by `videoID`. Checks if the session user's username appears in `likedBy`/`dislikedBy` and includes those boolean flags for the front end to style the like/dislike buttons correctly. |

---

### Module: `public/Login.js`

#### `sendLoginRequest(username, password)`
| Attribute | Detail |
|---|---|
| **Parameters** | `username: string`, `password: string` |
| **Returns** | `Promise<object>` — parsed JSON response data |
| **Overview** | Makes a `POST /auth/login` fetch call with JSON body. Throws on non-OK HTTP status. |

#### `handleLogin()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `void` — attaches an event listener |
| **Overview** | Attaches a `submit` listener to the login form. On submit, calls `sendLoginRequest()`. If `data.user.firstLogin` is true, redirects to `NewUser.html`; otherwise redirects to `Gallery.html`. Displays `alert()` on error. |

---

### Module: `public/Gallery.js`

#### `fetchUserInfo()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<object\|null>` — session user info or null |
| **Overview** | Calls `POST /auth/user` to retrieve the current session state. |

#### `checkUserRole()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `fetchUserInfo()`. Redirects to `Login.html` if not logged in. Shows or hides the "Add Movie" button based on whether the user's role is `admin` or `content editor`. |

#### `fetchMovies()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<Array>` — array of movie objects, or `[]` on error |
| **Overview** | Calls `GET /movies/all-movies` and returns the parsed movie array. |

#### `displayMovies()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `fetchMovies()`, sorts the result alphabetically by title, then dynamically builds and appends gallery card DOM elements (thumbnail from YouTube image CDN, title, like/dislike counts) for each movie into `#div_gallery_grid`. Each card is a link to `VideoPlayer.html?videoID=...`. |

#### `logout()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `POST /auth/logout` then redirects to `Login.html`. |

---

### Module: `public/VideoPlayer.js`

#### `fetchUserInfo()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<object\|null>` |
| **Overview** | Calls `POST /auth/user`; stores result in module-scoped `userInfo`. |

#### `checkUserLogin()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<boolean>` |
| **Overview** | Returns `false` and redirects to `Login.html` if `userInfo` is absent or `loggedIn` is false. |

#### `getMovieIDUrl()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `string\|null` — value of `videoID` query parameter |
| **Overview** | Parses `window.location.search` using `URLSearchParams` to extract the `videoID` parameter passed from the Gallery. |

#### `loadMovie()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Fetches movie data from `GET /movies/:movieID`. Populates the page title, genre, description, and YouTube embed `iframe` src. Sets like/dislike counts. Shows manager controls (edit/delete) for `content editor` and `admin` roles; shows comment submission UI for `marketing manager` and `admin` roles. Adds `rated` CSS class to the appropriate button if the current user has already liked or disliked. |

#### `renderComments(comments)`
| Attribute | Detail |
|---|---|
| **Parameters** | `comments: Array<{ username: string, comment: string }>` |
| **Returns** | `void` |
| **Overview** | Clears `#div_comments` and re-renders each comment as a styled `<div>` with a bold username label and paragraph text. If the array is empty, shows a "No comments yet" message. |

#### `likeMovie()`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads `videoID` from URL) |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `POST /movies/:movieID/like`. Updates the like/dislike count spans and toggles the `rated` CSS class on the like/dislike buttons based on the `liked` boolean in the response. |

#### `dislikeMovie()`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads `videoID` from URL) |
| **Returns** | `Promise<void>` |
| **Overview** | Mirror of `likeMovie()` — calls `POST /movies/:movieID/dislike` and updates the UI accordingly. |

#### `submitComment()`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads text from `#text_new_comment`) |
| **Returns** | `Promise<void>` |
| **Overview** | Validates that the comment text is non-empty. Posts `{ text }` to `POST /movies/:movieID/comment`. On success, calls `renderComments()` with the returned updated comments array and clears the text field. |

#### `deleteMovie()`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads `videoID` from URL) |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `DELETE /movies/delete/:movieID`. On success, alerts the user and redirects to `Gallery.html`. |

#### `editRedirect()`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads `videoID` from URL) |
| **Returns** | `Promise<void>` |
| **Overview** | Redirects to `AddMovie.html?videoID=<movieID>`, passing the current video ID so the Add/Edit page can pre-fill the form in edit mode. |

#### `init()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Entry point called on `DOMContentLoaded`. Fetches user info, validates login, loads the movie, and conditionally shows edit/delete buttons for `content editor` and `admin` roles. |

---

### Module: `public/AddMovie.js`

#### `getMovieIDUrl()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `string\|null` |
| **Overview** | Extracts `videoID` from the URL query string to determine whether the page is in "add" or "edit" mode. |

#### `extractVideoID(url)`
| Attribute | Detail |
|---|---|
| **Parameters** | `url: string` — a full YouTube URL |
| **Returns** | `string\|null` — the 11-character YouTube video ID, or `null` if invalid |
| **Overview** | Applies a regex that handles standard YouTube URL formats (`watch?v=`, `youtu.be/`, `embed/`) and extracts the 11-character video ID. |

#### `updateMovie(movieData, movieID)`
| Attribute | Detail |
|---|---|
| **Parameters** | `movieData: { title, genre, description }`, `movieID: string` |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `PUT /movies/update-movie/:movieID` with the provided data. On success, alerts the user and redirects back to `VideoPlayer.html?videoID=<movieID>`. |

#### `submitMovie(movieData)`
| Attribute | Detail |
|---|---|
| **Parameters** | `movieData: { title, genre, videoID, description }` |
| **Returns** | `Promise<void>` |
| **Overview** | Calls `POST /movies/add-movie` with the full movie data. On success, alerts and redirects to `Gallery.html`. |

#### `fetchMovieData(movieID)`
| Attribute | Detail |
|---|---|
| **Parameters** | `movieID: string` |
| **Returns** | `Promise<object>` — movie document |
| **Overview** | Calls `GET /movies/:movieID` and returns the `movie` object for pre-filling the edit form. |

#### `handleSubmit()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Central form submission handler. Reads and validates all inputs. Branches on whether a `videoID` URL param exists: if so, calls `updateMovie()`; otherwise extracts the YouTube video ID via `extractVideoID()` and calls `submitMovie()`. |

#### `prefillForm(movie)`
| Attribute | Detail |
|---|---|
| **Parameters** | `movie: object` — a movie document |
| **Returns** | `Promise<void>` |
| **Overview** | Populates all form fields with existing movie data when the page loads in edit mode. Reconstructs the YouTube URL from the stored `videoID`. |

#### `init()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` |
| **Overview** | Checks user role (must be `admin` or `content editor`). If a `videoID` URL param is present, switches the page to edit mode: changes the heading to "Edit Movie", hides the YouTube link input, sets the back-button href, fetches existing movie data, and calls `prefillForm()`. |

---

### Module: `public/NewUser.js`

#### `updateAccountData(username)`
| Attribute | Detail |
|---|---|
| **Parameters** | `username: string` |
| **Returns** | `Promise<void>` |
| **Overview** | Posts security questions, answers, and new password to `POST /auth/update-user-account` to complete first-login account setup. |

#### `getUsername()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<string>` — the session user's username |
| **Overview** | Calls `POST /auth/user` and extracts `data.user.username` from the response to use in the account update request. |

#### `newAccountSetup()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `void` — attaches a `submit` event listener |
| **Overview** | Validates that all fields are filled and that the new password satisfies the regex (`8–16 chars, uppercase, lowercase, digit, special char /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_.])[a-zA-Z0-9!@#$%^&*?_.]{8,16}$/`). Calls `getUsername()` then `updateAccountData()`. On success, alerts the user and redirects to `Login.html`. |

---

### Module: `public/PasswordReset.js`

#### `securityQuestionsRequest(username)`
| Attribute | Detail |
|---|---|
| **Parameters** | `username: string` |
| **Returns** | `Promise<void>` |
| **Overview** | Posts `{ username }` to `POST /auth/security-questions`. Populates the two security question `<label>` elements with the returned question text and reveals the second form (`#form_new_password`). |

#### `handleUsernameSubmission()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `void` |
| **Overview** | Attaches a `submit` listener to `#form_username` that reads the username field value and calls `securityQuestionsRequest()`. |

#### `updatePassword()`
| Attribute | Detail |
|---|---|
| **Parameters** | None (reads from form fields) |
| **Returns** | `Promise<object>` — server response data |
| **Overview** | Validates the new password against the regex. Posts `{ username, answer1, answer2, newPassword }` to `POST /auth/update-password`. Throws on validation failure or non-OK HTTP response. |

#### `handleNewPasswordSubmission()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `void` |
| **Overview** | Attaches a `submit` listener to `#form_new_password`. Calls `updatePassword()` and on success displays a confirmation alert and redirects to `Login.html`. |

### Module: `seedTestDB.js`

#### `seedTestDB()`
| Attribute | Detail |
|---|---|
| **Parameters** | None |
| **Returns** | `Promise<void>` — resolves when seeding is complete, logs to console, and closes the connection. | 
| **Overview** | Connects directly to the `SCProject` database via `MongoClient`. It first drops all existing records by calling `deleteMany({})` on both the `users` and `movies` collections. It then uses `insertMany()` to populate the collections with default data: 4 test users (one for each role: `admin1`, `editor1`, `manager1`, `viewer1` with pre-hashed passwords) and 18 test movies (including YouTube `videoID`s, default counters, and sample comments). Finally, it safely calls `client.close()` to terminate the connection. |

---

> **LLM Disclosure**:
> This document was generated by using the LLM agent Claude Sonnet 4.6. (accessed via github.com chat interface). Prompt: "You are an experienced technical writer. Generate developer documentation from the attached github repo. It must have the following content. 1. a diagram showiing the major modules of the software and informatoin flow among those modules and 2. a table of diagram mapping the modules to the source-code file. 3. Describe the major functions in each module with a function name, parameters taken by the function, results returned by that function, and implementation overview." The files uploaded/read were: `server.js`, `db.js`, `package.json`, `routes/auth.js`, `routes/movies.js`, `public/Login.js`, `public/Gallery.js`, `public/VideoPlayer.js`, `public/AddMovie.js`, `public/NewUser.js`, and `public/PasswordReset.js`.
>
> **Reflection:** The LLM was accurate in describing database connection modules and server configuration. It also did well creating the documentation for movies.js and auth.js. There were some issues with routing in the documentation. It also didn't create documentation for seedTestDB.js, which I had to add manually later. I also had to add text specifying how the password uses Regex. It generated much of the documentation for functions and modules correctly in db.js, server.js, auth.js end points, and movies.js. Overall it helped a lot with creating the document but there were a few mistakes that needed to be carefully looked over and corrected. 
