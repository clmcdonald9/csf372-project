const GALLERY_GRID = document.getElementById("div_gallery_grid");

async function fetchMovies() {
    try {
        const response = await fetch('/movies');
        const movies = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        
        return movies;

    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

async function displayMovies() {
    const movies = await fetchMovies();
    let gallery_item;
    let movie_link;

    GALLERY_GRID.innerHTML = '';

    for (const movie of movies) {
        gallery_item = document.createElement('div');
        gallery_item.classList.add('gallery_item');

        movie_link = document.createElement('a');
        movie_link.href = `VideoPlayer.html?videoID=${movie.videoID}`;

        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${movie.videoID}/0.jpg`;
        thumbnail.alt = movie.title;

        const title = document.createElement('p');
        title.textContent = movie.title;

        movie_link.appendChild(thumbnail);
        gallery_item.appendChild(movie_link);
        gallery_item.appendChild(title);
        GALLERY_GRID.appendChild(gallery_item);
    }
}

displayMovies();