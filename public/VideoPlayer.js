// Updateable variables for the video player.
const HEADING_TITLE = document.getElementById('heading_movie_title');
const VIDEO_PLAYER = document.getElementById('iframe_video_player');
const MOVIE_DESCRIPTION = document.getElementById('p_movie_description');

const BUTTON_LIKE = document.getElementById('button_like');
const BUTTON_DISLIKE = document.getElementById('button_dislike');
const SPAN_LIKE = document.getElementById('span_like_count');
const SPAN_DISLIKE = document.getElementById('span_dislike_count');

// Content manager and editor html elements.
const Manager_controls = document.getElementById('id_manager_controls');
const COMMENTS = document.getElementById('div_comments');
const ADD_COMMENT = document.getElementById('div_add_comment');

// Comment section elements.
const TEXT_NEW_COMMENT = document.getElementById('text_new_comment');
const BUTTON_SUBMIT_COMMENT = document.getElementById('button_submit_comment');

let USER_INFO = null;

async function fetchUserInfo() {
    try {
        const response = await fetch('/auth/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        
        const userInfo = await response.json();
        return userInfo;

    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}

async function checkUserRole() {

    if (!userInfo || !userInfo.loggedIn) {
        window.location.href = 'Login.html';
        return false;
    }
    return true;
}

// Function to get the movie ID from the URL parameters.
function getMovieIDUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('videoID');
}

async function loadMovie() {
    const movieID = getMovieIDUrl();
    const role = userInfo.user.role;

    if (!movieID) {
        alert('No movie ID provided in the URL.');
        return;
    }

    try {
        const response = await fetch(`/movies/${movieID}`);

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load movie.');
        }
        
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to load movie data.');
        }

        const movie = data.movie;

        // Update the video player with the movie data.
        HEADING_TITLE.textContent = movie.title;
        MOVIE_DESCRIPTION.textContent = movie.description;

        VIDEO_PLAYER.src = `https://www.youtube.com/embed/${movie.videoID}?rel=0&modestbranding=1`;

        // Update the like and dislike counts.
        SPAN_LIKE.textContent = movie.likes;
        SPAN_DISLIKE.textContent = movie.dislikes;


        if (role == 'content editor' || role == 'marketing manager' || role == 'admin') {
            Manager_controls.style.display = 'block';
            renderComments(movie.comments || []);
        }
        
        if (role === 'marketing manager' || role === 'admin') {
            ADD_COMMENT.style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading movie:', error);
        HEADING_TITLE.textContent = 'Error loading movie';
        MOVIE_DESCRIPTION.textContent = error.message;
    }
    return;
}

function renderComments(comments) {
    COMMENTS.innerHTML = '';

    console.log('Rendering comments:', comments);

    if (comments.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No comments yet.';
        COMMENTS.appendChild(emptyMessage);
        return;
    }

    comments.forEach(function (comment) {
        console.log('Rendering comment:', comment);
        const div = document.createElement('div');
        div.style.borderBottom = '1px solid #ccc';
        div.style.padding = '10px 0';

        const author = document.createElement('strong');
        author.textContent = comment.username + ': ';

        const text = document.createElement('p');
        text.textContent = comment.comment;
        text.style.margin = '5px 0';

        div.appendChild(author);
        div.appendChild(text);
        COMMENTS.appendChild(div);
    });
    return;
}   

async function likeMovie() {
    const movieTitle = getMovieIDUrl();

    try {
        const response = await fetch(`/movies/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoID: movieTitle })
        });
        const data = await response.json();

        if (data.success) {
            SPAN_LIKE.textContent = data.likes;
        }
    } catch (error) {
        console.error('Error liking movie:', error);
    }

    return;
}

async function dislikeMovie() {
    const movieTitle = getMovieIDUrl();

    try {
        const response = await fetch(`/api/movies/` + movieTitle + `/dislike`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            SPAN_DISLIKE.textContent = data.dislikes;
        }
    } catch (error) {
        console.error('Error disliking movie:', error);
    }
    return;
}

async function submitComment() {
    const movieID = getMovieIDUrl(); 
    const text = TEXT_NEW_COMMENT.value.trim();
    const username = userInfo.user.username;

    if (text === '') {
        alert('Please enter a comment.');
        return;
    }

    try {
        
        const response = await fetch('movies/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username,
                text: text,
                movieID: movieID
            })
        });
        const data = await response.json();

        if (data.success) {
            renderComments(data.comments);
            TEXT_NEW_COMMENT.value = '';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment.');
    }

    return;
}

async function init() {
    userInfo = await fetchUserInfo();
    const isAuthorized = await checkUserRole();
    if (isAuthorized) {
        await loadMovie();
    }
}

// Like and dislike buttons.
BUTTON_LIKE.addEventListener('click', likeMovie);
BUTTON_DISLIKE.addEventListener('click', dislikeMovie);

// Comment submit button.
if (BUTTON_SUBMIT_COMMENT) {
    BUTTON_SUBMIT_COMMENT.addEventListener('click', submitComment);
}

// Load the movie when the page is ready.
document.addEventListener('DOMContentLoaded', init);