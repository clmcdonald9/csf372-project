// Updateable variables for the video player.
const HEADING_TITLE = document.getElementById('heading_movie_title');
const VIDEO_SOURCE = document.getElementById('source_video');
const VIDEO_PLAYER = document.getElementById('video_player');
const PARAGRAPH = document.getElementById('paragraph_movie_description');

const BUTTON_LIKE = document.getElementById('button_like');
const BUTTON_DISLIKE = document.getElementById('button_dislike');
const SPAN_LIKE = document.getElementById('span_like_count');
const SPAN_DISLIKE = document.getElementById('span_dislike_count');

// Content manager and editor html elements.
const CONTENT_EDITOR = document.getElementById('content_editor');
const COMMENTS = document.getElementById('Comments');
const ADD_COMMENT = document.getElementById('add_comment');

// Video player buttons.
const PLAY_BUTTON = document.getElementById('play_button');
const PAUSE_BUTTON = document.getElementById('pause_button');
const STOP_BUTTON = document.getElementById('stop_button');
const REWIND_BUTTON = document.getElementById('rewind_button');
const FAST_FORWARD_BUTTON = document.getElementById('fast_forward_button');

// Comment section elements.
const TEXT_NEW_COMMENT = document.getElementById('text_new_comment');
const BUTTON_SUBMIT_COMMENT = document.getElementById('button_submit_comment');

// Function to get the movie ID from the URL parameters.
function getMovieIDUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('videoID');
}

async function loadMovie() {
    const movieID = getMovieIDUrl();
    if (!movieID) {
        alert('No movie ID provided in the URL.');
        return;
    }

    try {
        const response = await fetch(`/api/movies/${movieID}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load movie.');
        }

        if (!data.success) {
            throw new Error(data.message || 'Failed to load movie data.');
        }

        const movie = data.movie;
        const role = sessionStorage.getItem('userRole');

        // Update the video player with the movie data.
        HEADING_TITLE.textContent = movie.title;
        PARAGRAPH.textContent = movie.description;
        
        VIDEO_SOURCE.src = movie.videoPath;
        VIDEO_PLAYER.load();

        // Update the like and dislike counts.
        SPAN_LIKE.textContent = movie.likes;
        SPAN_DISLIKE.textContent = movie.dislikes;


        if (role == 'content_editor' || role == 'marketing_manager') {
            CONTENT_EDITOR.style.display = 'block';
            renderComments(movie.comments || []);
        }
        
        if (role == 'marketing_manager') {
            ADD_COMMENT.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading movie:', error);
        HEADING_TITLE.textContent = 'Error loading movie';
        PARAGRAPH.textContent = error.message;
    }
    return;
}

function renderComments(comments) {
    COMMENTS.innerHTML = '';

    if (comments.length === 0) {
        COMMENTS.innerHTML = '<p><em>No comments yet.</em></p>';
        return;
    }

    comments.forEach(function (comment) {
        const div = document.createElement('div');
        div.style.borderBottom = '1px solid #ccc';
        div.style.padding = '10px 0';

        const author = document.createElement('strong');
        author.textContent = comment.author;

        const text = document.createElement('p');
        text.textContent = comment.text;
        text.style.margin = '5px 0';

        div.appendChild(author);
        div.appendChild(text);
        COMMENTS.appendChild(div);
    });
    return;
}   

async function likeMovie() {
    const movieTitle = getMovieTitleUrl();

    try {
        const response = await fetch(`/api/movies/` + movieTitle + `/like`, {
            method: 'POST'
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
    const movieTitle = getMovieTitleUrl();

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
    const movieTitle = getMovieTitleUrl(); 
    const text = TEXT_NEW_COMMENT.value.trim();

    if (text === '') {
        alert('Please enter a comment.');
        return;
    }

    try {
        
        const response = await fetch('/api/movies/' + movieTitle + '/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
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

// Playback controls.
PLAY_BUTTON.addEventListener('click', function () {
    VIDEO_PLAYER.play();
    return;
});

PAUSE_BUTTON.addEventListener('click', function () {
    VIDEO_PLAYER.pause();
    return;
});

STOP_BUTTON.addEventListener('click', function () {
    VIDEO_PLAYER.pause();
    VIDEO_PLAYER.currentTime = 0;
    return;
});

REWIND_BUTTON.addEventListener('click', function () {
    VIDEO_PLAYER.currentTime = Math.max(0, VIDEO_PLAYER.currentTime - 10);
    return;
});

FAST_FORWARD_BUTTON.addEventListener('click', function () {
    VIDEO_PLAYER.currentTime = Math.min(VIDEO_PLAYER.duration, VIDEO_PLAYER.currentTime + 10);
    return;
});

// Like and dislike buttons.
BUTTON_LIKE.addEventListener('click', likeMovie);
BUTTON_DISLIKE.addEventListener('click', dislikeMovie);

// Comment submit button.
if (BUTTON_SUBMIT_COMMENT) {
    BUTTON_SUBMIT_COMMENT.addEventListener('click', submitComment);
}

// Load the movie when the page is ready.
document.addEventListener('DOMContentLoaded', loadMovie);