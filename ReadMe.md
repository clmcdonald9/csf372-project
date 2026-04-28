# UAF Films

The final project for CSF372 - Software Construction. Viewers can browse a gallery of embedded videos, and watch, like, like, and dislike content. Staff roles can manage the movie catalog through the site.

---

## 1. Prerequisites

### Hardware
- A computer capable of running a modern web browser and Node.js
- Internet connection (required to load YouTube-embedded videos)

### Software
- **Node.js** v18 or higher — [https://nodejs.org/](https://nodejs.org/)
- **MongoDB Community Server** — [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- A modern web browser (Chrome, Firefox, Edge, or Safari)

---

## 2. Installation and Setup

### Step 1 — Install dependencies
Open a terminal in the project folder and run:
```bash
npm install
```

### Step 2 — Start MongoDB
In a terminal, start the MongoDB shell to confirm MongoDB is running:
```bash
mongosh
```
MongoDB must be running on the default port `27017` before proceeding.

### Step 3 — Seed the database
In a **separate** terminal, run:
```bash
node seedTestDB.js
```
This creates the `SCProject` database and populates it with 4 test user accounts and 18 movies. It can be re-run at any time to reset the database to its original state.

### Step 4 — Start the server
```bash
node server.js
```
The server will start on port 3000. You should see a confirmation message in the terminal.

### Step 5 — Open the app
In a browser, navigate to:
```
http://localhost:3000
```

### Test Accounts

All accounts start with `firstLogin: true`. The first time you log in to any account you will be taken to the **Secure Your Account** page to set security questions and a new password.

| Username | Password | Role |
|---|---|---|
| `admin1` | `password123` | Admin |
| `editor1` | `password123` | Content Editor |
| `manager1` | `password123` | Marketing Manager |
| `viewer1` | `password123` | Viewer |

> To skip the first-login setup for an account, change `firstLogin: true` to `firstLogin: false` for that user in `seedTestDB.js` and re-run the seed script.

---

## 3. GUI Controls by Page

### Login Page (`Login.html`)

| Control | Description |
|---|---|
| **Username** field | Text input for the user's account username. |
| **Password** field | Masked text input for the user's password. |
| **Submit** button | Submits the login form. On success, redirects to the account setup page (first login) or the gallery (returning user). On failure, displays an error message. |
| **Forgot Password?** link | Navigates to the Password Reset page. |

---

### Secure Your Account Page (`NewUser.html`) — First Login Only

This page appears automatically after a user's first login. The user must complete it before accessing the rest of the app.

| Control | Description |
|---|---|
| **Security Question 1** field | Text input where the user writes their first security question. This will be used to verify identity during a password reset. |
| **Answer for Security Question 1** field | Text input for the answer to the first security question. |
| **Security Question 2** field | Text input where the user writes their second security question. |
| **Answer for Security Question 2** field | Text input for the answer to the second security question. |
| **New Password** field | Masked text input for the user's new password. Must be 8–16 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character (`!@#$%^&*?_.`). |
| **Update** button | Submits the form. Saves the security questions and new password, then redirects to the Login page. All fields must be filled in and the password must meet the requirements for submission to succeed. |

---

### Gallery Page (`Gallery.html`)

The main page of the app. Displays all movies in an alphabetically sorted grid.

| Control | Description |
|---|---|
| **Gallery** nav link | Reloads the Gallery page. |
| **Logout** nav link | Ends the current session and redirects to the Login page. |
| **Add a Movie** button | *(Visible to admins and content editors only)* Navigates to the Add Movie page. |
| **Movie card** | Each card in the grid shows a video thumbnail, title, and like/dislike counts. Clicking anywhere on a card navigates to the Video Player page for that movie. |

---

### Video Player Page (`VideoPlayer.html`)

Plays a selected movie and provides interaction controls.

| Control | Description |
|---|---|
| **Gallery** nav link | Returns to the Gallery page. |
| **Logout** nav link | Ends the current session and redirects to the Login page. |
| **Video player** | An embedded YouTube video player for the selected movie. Supports standard YouTube playback controls (play, pause, volume, fullscreen). |
| **Like** button | Adds a like for the current user. If the user already liked the video, clicking again removes the like (toggle). If the user had previously disliked it, the dislike is removed and a like is added. The current like count is shown on the button. |
| **Dislike** button | Adds a dislike for the current user. Behaves as a toggle, same as the Like button. The current dislike count is shown on the button. |
| **Edit** button | *(Visible to admins and content editors only)* Navigates to the Add/Edit Movie page with the current movie's information pre-filled for editing. |
| **Delete** button | *(Visible to admins and content editors only)* Opens a confirmation dialog before deleting the movie. |
| **Delete Movie** confirmation button | Appears inside the delete confirmation dialog. Permanently deletes the movie and redirects to the Gallery. |
| **About this film** section | Displays the movie's genre and description. Not interactive. |
| **Manager Comments** section | *(Visible to admins, content editors, and marketing managers only)* Displays all comments posted on the movie. |
| **Comment input** field | *(Visible to admins and marketing managers only)* Text input to write a new comment. |
| **Add Comment** button | *(Visible to admins and marketing managers only)* Submits the comment and displays it immediately in the comments list. |

---

### Add / Edit Movie Page (`AddMovie.html`)

Used to add a new movie or edit an existing one. Accessible to admins and content editors only.

| Control | Description |
|---|---|
| **Movie Title** field | Text input for the movie's title. Required. |
| **Genre** field | Text input for the movie's genre (e.g., educational, gaming, comedy). Required. |
| **YouTube Link** field | *(Add mode only)* Text input for the full YouTube URL of the video (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`). The app automatically extracts the video ID from the URL. Hidden in edit mode since the video cannot be changed. |
| **Movie Description** text area | Multi-line text input for a description of the movie. Required. |
| **Submit** button | In add mode: creates the new movie and redirects to the Gallery. In edit mode: saves changes to the movie's title, genre, and description and redirects to the Gallery. |
| **Back** button | Returns to the Gallery page without saving. |

---

### Password Reset Page (`PasswordReset.html`)

Allows a user to reset their password without logging in, using their security questions.

| Control | Description |
|---|---|
| **Username** field | Text input for the account username to reset. |
| **Next** button | Submits the username and fetches that user's security questions. The question form below appears only after a valid username is entered. |
| **Security question answer** fields | Two text inputs displaying the user's saved security questions as labels. The user types their answers here to verify their identity. |
| **New Password** field | Masked text input for the new password. Must meet the same complexity requirements as the account setup page. |
| **Update Password** button | Verifies the security question answers and, if correct, updates the password. Redirects to the Login page on success. |
| **Back to Login** link | Returns to the Login page without making any changes. |
