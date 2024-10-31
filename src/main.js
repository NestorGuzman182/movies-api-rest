import { KEY } from "./key.js";
import { init, change } from "./navigation.js"
import { detailMovieContainer, 
        trendingPreviewContainer, 
        categoriesPreviewContainer, 
        searchPreviewContainer,
        similarMoviesContainer,
        categoryLabel,
        resultSearchLabel,
        movieSection, 
        searchInput
} from './nodes.js';

init, change;
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-type': 'application/json;chartset=utf-8'
    },
    params: {
        'api_key': KEY
    }
});
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const url = entry.target.getAttribute('data-image');
            entry.target.setAttribute('src', url)
        }
        console.log(entry)
    });
})
let intervalId;
const baseImgURL = 'https://image.tmdb.org/t/p/w300';


export const getTrendingMoviesPreview = async function  getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day?');
    const movies = data.results;
    
    let index=0;

    if(intervalId) {
        clearInterval(intervalId)
    }

    renderMoviesList(trendingPreviewContainer, movies, true);

    renderHeroMovie(movies[index]);
    intervalId = setInterval(() => {
        index = (index + 1) % movies.length;
        renderHeroMovie(movies[index]);
    }, 7000);

}

export const getCategoriesPreview = async function  getCategoriesPreview() {
    const { data } = await api('genre/movie/list?');
    
    const categories = data.genres;
    renderCategoryList(categoriesPreviewContainer, categories);
}

export const getResultSearchMovies = async function getResultSearchMovies(query) {
    const { data } = await api('search/movie', {
        params: { query }
    });

    const movies = data.results;
    if(movies.length === 0){
        searchPreviewContainer.innerHTML = '';
        const notFoundText = document.createElement('h1');
        notFoundText.classList.add('title');
        notFoundText.textContent = 'No se han encontrado resultados.';
        notFoundText.style.width = '100vw';
        searchPreviewContainer.appendChild(notFoundText)
    }else{
        resultSearchLabel.textContent = searchInput.value;
        renderMoviesList(searchPreviewContainer, movies, true);
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day?');
    const movies = data.results;
    
    renderMoviesList(trendingPreviewContainer, movies);
}

async function  getMoviesByCategories(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        }
    });
    const movies = data.results;
    renderMoviesList(categoriesPreviewContainer, movies, true)
}

function renderHeroMovie(movie) {
    const hero = document.getElementById('hero');
    hero.classList.remove('loader');
    hero.style.opacity = '0';

    setTimeout(() => {
        const imageBackground = `url(${baseImgURL + movie.backdrop_path})`;
        hero.style.backgroundImage = `
            linear-gradient(to right, rgba(0,0,0,0.7) 10%, transparent 90%),
            linear-gradient(to top, rgba(0,0,0, 1) 5%, transparent 95%),
            ${imageBackground}`;
        hero.style.opacity = '1';
        const heroInfo = document.querySelector('.hero-info');
        heroInfo.innerHTML = '';
        const containerTitle = document.createElement('h3');
        heroInfo.appendChild(containerTitle)
        containerTitle.classList.add('title')
        containerTitle.textContent = movie.title
    
        const synopsisContainer = document.createElement('p');
        heroInfo.appendChild(synopsisContainer);
        synopsisContainer.classList.add('description')
        synopsisContainer.textContent = movie.overview;
    
        playtrailerButton(heroInfo);
    }, 1000);
 
}

function renderMoviesList(container, movies, lzLoad=false) {
    container.innerHTML = '';


    movies.map(movie => {
        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.classList.remove('loader');
        movieImg.setAttribute('alt', movie.title);
        console.log(movie.poster_path === null)
        movieImg.setAttribute( 
            lzLoad ? 'data-image': 'src', 
            movie.poster_path ? baseImgURL + movie.poster_path : '../src/img/movie-poster-template-03.jpg'
        )
       if(lzLoad) {
           lazyLoader.observe(movieImg);
       }

        const titleMovie = document.createElement('p');
        titleMovie.textContent = movie.title;

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(titleMovie)
        container.appendChild(movieContainer);

        movieContainer.addEventListener('click', () => {
            detailMovie(movie.id);
            location.hash = `#movie=${movie.id}`
        });
         
    });
}

function renderCategoryList(container, categories) {
    container.innerHTML = '';
    categories.map(category => {
        
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h5');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', category.id);

        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

        categoryTitle.addEventListener('click', () =>{ 
            location.hash = `#category=${category.id}`;
            categoryLabel.textContent = `: ${category.name}`
            const selectlabel = document.getElementById(category.id);
            selectlabel.style.background = '#FF640A';
            getMoviesByCategories(category.id);
        })
    });
}

async function detailMovie(id) {
    detailMovieContainer.innerHTML = '';
    const { data: movie } = await api(`movie/${id}`);

    movieSection.style.backgroundImage = `
        linear-gradient(to right, rgba(0,0,0,7), rgba(0,0,0,0.4)),
    linear-gradient(to top, rgba(0,0,0,6), rgba(0,0,0,0.2)),
        url(${baseImgURL + movie.poster_path})
    `

    const imgUrl = baseImgURL + movie.poster_path;
    const imageMovie = document.createElement('img');
    imageMovie.setAttribute('src', imgUrl);
    detailMovieContainer.appendChild(imageMovie);

    const infoMovie = document.createElement('div');
    detailMovieContainer.appendChild(infoMovie);

    const scoringContainer = document.createElement('p');
    scoringContainer.classList.add('scoring-container');
    const starIcon = document.createElement('i');
    starIcon.classList.add('fa-solid', 'fa-star', 'btn-secondary');
    scoringContainer.appendChild(starIcon);
    const score = document.createElement('span');
    score.textContent = movie.vote_average;
    scoringContainer.appendChild(score);
    infoMovie.appendChild(scoringContainer);

    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movie.title;
    movieTitle.classList.add('title');
    infoMovie.appendChild(movieTitle);

    const overviewMovie = document.createElement('p');
    overviewMovie.textContent = movie.overview;
    overviewMovie.classList.add('description');
    infoMovie.appendChild(overviewMovie);

    const releaseDate = document.createElement('p');
    releaseDate.classList.add('description');
    releaseDate.style.fontSize = 'x-small';
    releaseDate.innerHTML = `<strong>Released: </strong>${movie.release_date}`;
    infoMovie.appendChild(releaseDate);

    playtrailerButton(infoMovie);

    const categoriesListTemplate = `
            <h3 class="title" style="margin-top:">Categories</h3>
            <div class="categories-list"></div>
    `
    infoMovie.innerHTML += categoriesListTemplate;
    const movieDetailCategoriesList = document.querySelector('#movie-detail .categories-list');

    renderCategoryList(movieDetailCategoriesList, movie.genres);
    similarMoviesContainer.classList.add('slider-container');
    getSimilarMovies(similarMoviesContainer, movie.id);



    
}

async function getSimilarMovies(container, id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const similarMovies = data.results;

    renderMoviesList(container, similarMovies);
}

function playtrailerButton(container) {
    const playTrailerBtn = document.createElement('button');
    const iconPlay = document.createElement('i');
    container.appendChild(playTrailerBtn);
    playTrailerBtn.appendChild(iconPlay);
    iconPlay.classList.add('fa-solid', 'fa-play');
    playTrailerBtn.classList.add('btn', 'btn-primary');
    const buttonText = document.createTextNode(' PLAY TRAILER');
    playTrailerBtn.appendChild(buttonText);
}

getTrendingMoviesPreview();
getCategoriesPreview();