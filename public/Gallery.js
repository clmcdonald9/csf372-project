const GALLERY_GRID = document.getElementById("div_gallery_grid");
const ADD_BUTTON = document.getElementById('add_button');

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

    if (userInfo && (userInfo.user.role === 'admin' || userInfo.user.role === 'content editor')) {
        ADD_BUTTON.style.display = 'block';
        console.log(JSON.stringify(userInfo.user.role));
        console.log("role matched", userInfo.user.role);
    } else {
        ADD_BUTTON.style.display = 'none';
    }
}


async function fetchMovies() {
    try {
        const response = await fetch('/movies/all-movies');

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        
        const movies = await response.json();
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
        const likes = movie.likes
        const dislikes = movie.dislikes

        gallery_item = document.createElement('div');
        gallery_item.classList.add('gallery_item');

        movie_link = document.createElement('a');
        movie_link.href = `VideoPlayer.html?videoID=${movie.videoID}`;

        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${movie.videoID}/0.jpg`;
        thumbnail.alt = movie.title;
        thumbnail.classList.add('thumbnail');

        const movie_info = document.createElement('div');
        movie_info.classList.add('movie_details')

        const title = document.createElement('p');
        title.textContent = movie.title;
        title.classList.add('movie_title')

        const rating = document.createElement('div');
        rating.classList.add('rating');

        const likeCount = document.createElement('p');
        likeCount.innerHTML = ":) &nbsp;&nbsp;" + likes;

        const dislikeCount = document.createElement('p');
        dislikeCount.innerHTML = ":( &nbsp;&nbsp;" + dislikes;

        rating.appendChild(likeCount);
        rating.appendChild(dislikeCount);

        movie_info.appendChild(title);
        movie_info.appendChild(rating);

        movie_link.appendChild(thumbnail);
        gallery_item.appendChild(movie_link);
        gallery_item.appendChild(movie_info);
        
        GALLERY_GRID.appendChild(gallery_item);
    }
}

checkUserRole();
displayMovies();