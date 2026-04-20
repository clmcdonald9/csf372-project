const FORM = document.getElementById("form_add_movie");
const TITLE_INPUT = document.getElementById("text_title");
const GENRE_INPUT = document.getElementById("text_genre");
const YOUTUBE_LINK_INPUT = document.getElementById("text_youtube_link");
const DESCRIPTION_INPUT = document.getElementById("textarea_movie_description");

if (!FORM || !TITLE_INPUT || !YOUTUBE_LINK_INPUT || !DESCRIPTION_INPUT) {
    console.error("One or more form elements not found. Please check the HTML.");
}

function extractVideoID(url) {
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : null;
}

if (FORM) {
    FORM.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = TITLE_INPUT.value.trim();
        const youtubeLink = YOUTUBE_LINK_INPUT.value.trim();
        const description = DESCRIPTION_INPUT.value.trim();

        if(!title) { alert("Please enter a title for the movie."); return; }
        if(!youtubeLink) { alert("Please enter a YouTube link for the movie."); return; }
        if(!description) { alert("Please enter a description for the movie."); return; }

        videoID = extractVideoID(youtubeLink);

        if (!videoID) {
            alert("Please enter a valid YouTube link.");
            return;
        }

        alert(videoID);

    });
}