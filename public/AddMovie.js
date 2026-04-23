const PAGE_HEADING = document.getElementById('h2_page_heading')
const FORM = document.getElementById("form_add_movie");
const TITLE_INPUT = document.getElementById("text_title");
const GENRE_INPUT = document.getElementById("text_genre");
const YOUTUBE_LINK_INPUT = document.getElementById("text_youtube_link");
const LINK_LABEL = document.getElementById('label_youtube_link')
const DESCRIPTION_INPUT = document.getElementById("textarea_movie_description");
const BACK_BUTTON = document.getElementById('a_back')

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
    const userInfo = await fetchUserInfo();

    console.log("User info:", userInfo);

    if (!userInfo || !userInfo.loggedIn) {
        window.location.href = 'Login.html';
        return;
    }

    if (userInfo && (userInfo.user.role !== 'admin' && userInfo.user.role !== 'content editor')) {
        window.location.href = 'Gallery.html';
    }
}

function getMovieIDUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('videoID');
}

function extractVideoID(url) {
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : null;
}

async function updateMovie(movieData, movieID) {

    try {
        const response = await fetch(`/movies/update-movie/${movieID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(movieData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update movie')
        }

        alert('Movie updated successfully')
        window.location.href = `VideoPlayer.html?videoID=${movieID}`

    } catch (error) {
        console.error('Error updating movie:', error);
        alert('Error updating movie.');
    }
}

async function submitMovie(movieData) {
    try {
        const response = await fetch('/movies/add-movie', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(movieData)
        });        

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add movie');
        }


        alert('Movie added successfully!');
        window.location.href = 'Gallery.html';

    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Error adding movie. Please try again.');
    }
}

async function fetchMovieData(movieID) {
    try {
        const response = await fetch(`/movies/${movieID}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'failed to get movie')
        }

        return data.movie;

    } catch (error) {
        console.error('Error getting movie', error);
        alert(error.message)
    }
}

async function handleSubmit() {
    const movieID = getMovieIDUrl();

    const title = TITLE_INPUT.value.trim();
    const genre = GENRE_INPUT.value.trim();
    const description = DESCRIPTION_INPUT.value.trim();

    if(!title) { alert("Please enter a title for the movie."); return; }
    if(!description) { alert("Please enter a description for the movie."); return; }

    

    if (movieID) {
        const movieData = {
            title,
            genre,
            description
        }

        await updateMovie(movieData, movieID);
    } else {
        const youtubeLink = YOUTUBE_LINK_INPUT.value.trim();
        if(!youtubeLink) { alert("Please enter a YouTube link for the movie."); return; }

        const videoID = extractVideoID(youtubeLink);

        if (!videoID) {
            alert("Please enter a valid YouTube link.");
            return;
        }

        const movieData = {
                title,
                genre,
                videoID,
                description
            };

        await submitMovie(movieData);
    }

}

async function prefillForm(movie) {
    
    TITLE_INPUT.value = movie.title;
    GENRE_INPUT.value = movie.genre;
    YOUTUBE_LINK_INPUT.value = `https://www.youtube.com/watch?v=${movie.videoID}`;
    DESCRIPTION_INPUT.value = movie.description;
}

async function init() {
    await checkUserRole();

    const movieID = getMovieIDUrl();

    if (movieID) {
        PAGE_HEADING.textContent = 'Edit Movie'
        LINK_LABEL.textContent = `Video ID: ${movieID}`
        YOUTUBE_LINK_INPUT.style.display = 'none'
        BACK_BUTTON.href = `VideoPlayer.html?videoID=${movieID}`

        movie = await fetchMovieData(movieID)
        await prefillForm(movie);

    }
}

init();

if (FORM) {
    FORM.addEventListener("submit", async (event) => {
        event.preventDefault();
        handleSubmit();
    });
}