// Updateable variables for the video player.
const HEADING_TITLE = document.getElementById('heading_movie_title');
const VIDEO_PLAYER = document.getElementById('iframe_video_player');
const MOVIE_DESCRIPTION = document.getElementById('p_movie_description');
const MOVIE_GENRE = document.getElementById('p_genre')

const BUTTON_LIKE = document.getElementById('button_like');
const BUTTON_DISLIKE = document.getElementById('button_dislike');
const SPAN_LIKE = document.getElementById('span_like_count');
const SPAN_DISLIKE = document.getElementById('span_dislike_count');

// Content manager and editor html elements.
const Manager_controls = document.getElementById('id_manager_controls');
const COMMENTS = document.getElementById('div_comments');
const ADD_COMMENT = document.getElementById('div_add_comment');
const BUTTON_DELETE = document.getElementById('button_delete');
const BUTTON_EDIT = document.getElementById('button_edit')
const CONFIRM_DELETE = document.getElementById('button_confirm_delete')

// Comment section elements.
const TEXT_NEW_COMMENT = document.getElementById('text_new_comment');
const BUTTON_SUBMIT_COMMENT = document.getElementById('button_submit_comment');

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

async function checkUserLogin(userInfo) {

    if (!userInfo || !userInfo.loggedIn) {
        window.location.href = 'Login.html';
        return false;
    }
    return true;
}

async function logout() {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = 'Login.html';
}
document.getElementById('logout_link').addEventListener('click', logout);

window.addEventListener('pageshow', async (event) => {
    if (event.persisted) {
        const userInfo = await fetchUserInfo();
        if (!userInfo || !userInfo.loggedIn) {
            window.location.href = 'Login.html';
        }
    }
});

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
            throw new Error(response.json.error || 'Failed to load movie.');
        }
        
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to load movie data.');
        }

        const movie = data.movie;

        // Update the video player with the movie data.
        HEADING_TITLE.textContent = movie.title;
        MOVIE_GENRE.textContent = movie.genre;
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

        if (data.userLiked) {
            BUTTON_LIKE.classList.add('rated');
        }

        if (data.userDisliked) {
            BUTTON_DISLIKE.classList.add('rated');
        }

    } catch (error) {
        console.error('Error loading movie:', error);
        HEADING_TITLE.textContent = 'Error loading movie';
        MOVIE_DESCRIPTION.textContent = error.message;
        alert('Failed to load movie: ' + error.message);
    }
    return;
}

function renderComments(comments) {
    COMMENTS.innerHTML = '';

    if (comments.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No comments yet.';
        COMMENTS.appendChild(emptyMessage);
        return;
    }

    comments.forEach(function (comment) {
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
        const response = await fetch(`/movies/${movieTitle}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoID: movieTitle })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to like movie.');
        }

        SPAN_DISLIKE.textContent = data.dislikes;
        SPAN_LIKE.textContent = data.likes;

        if (data.liked) {
            BUTTON_LIKE.classList.add('rated');
            BUTTON_DISLIKE.classList.remove('rated');
        } else {
            BUTTON_LIKE.classList.remove('rated');
        }

    } catch (error) {
        console.error('Error liking movie:', error);
        alert('Failed to like movie: ' + error.message);
    }

    return;
}

async function dislikeMovie() {
    const movieTitle = getMovieIDUrl();

    try {
        const response = await fetch(`/movies/${movieTitle}/dislike`, {
            method: 'POST'
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to dislike movie.');
        }

        SPAN_DISLIKE.textContent = data.dislikes;
        SPAN_LIKE.textContent = data.likes;

        if (data.disliked) {
            BUTTON_DISLIKE.classList.add('rated');
            BUTTON_LIKE.classList.remove('rated');
        } else {
            BUTTON_DISLIKE.classList.remove('rated');
        }

    } catch (error) {
        console.error('Error disliking movie:', error);
        alert('Failed to dislike movie: ' + error.message);
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
        
        const response = await fetch(`/movies/${movieID}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                text: text,
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

async function deleteMovie() {
    const movieID = getMovieIDUrl()

    try {
        const response = await fetch(`/movies/delete/${movieID}`,{
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("error deleting movie");
        }

        alert('Movie successfully deleted');
        window.location.href = 'Gallery.html';
    } catch (error) {
        console.error(error);
    }

}

async function editRedirect() {
    const movieID = getMovieIDUrl();
    window.location.href = `AddMovie.html?videoID=${movieID}`;
}

async function init() {
    const userInfo = await fetchUserInfo();

    const isAuthorized = await checkUserLogin(userInfo);
    if (isAuthorized) {
        await loadMovie();
    }

    if (userInfo.user.role === 'content editor' || userInfo.user.role === 'admin') {
        BUTTON_DELETE.style.display = '';
        BUTTON_EDIT.style.display = '';
    }
}

// Like and dislike buttons.
BUTTON_LIKE.addEventListener('click', likeMovie);
BUTTON_DISLIKE.addEventListener('click', dislikeMovie);
CONFIRM_DELETE.addEventListener('click', deleteMovie);
BUTTON_EDIT.addEventListener('click', editRedirect);

// Comment submit button.
if (BUTTON_SUBMIT_COMMENT) {
    BUTTON_SUBMIT_COMMENT.addEventListener('click', submitComment);
}

// Load the movie when the page is ready.
document.addEventListener('DOMContentLoaded', init);