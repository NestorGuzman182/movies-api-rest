import { KEY } from "./key.js";
import { init, change, infiniteScrolling } from "./navigation.js"
import { detailMovieContainer, 
        trendingPreviewContainer, 
        categoriesPreviewContainer,
        favoritesMoviesContainer, 
        searchPreviewContainer,
        similarMoviesContainer,
        generalMoviesContainer,
        categoryLabel,
        resultSearchLabel, 
        movieSection, 
        searchInput,
        generalTitle
} from './nodes.js';
import { createLanguages, lang } from "./language.js";

init, change, infiniteScrolling;
createLanguages();

//  Data

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-type': 'application/json;chartset=utf-8'
    },
    params: {
        'api_key': KEY
    }
});

function favoritesMoviesList () {
    return JSON.parse(localStorage.getItem('liked_movies')) || [];
}

function saveFavoriteMovie(movie) {
    const listMovies = favoritesMoviesList();

    if(listMovies.length > 0 && listMovies.find( item => item.id === movie.id)) {
        const arr = listMovies.findIndex(item => item.id === movie.id)
        favoriteMovies.splice(arr, 1)
    } else {
        favoriteMovies.push(movie)
    }
    localStorage.setItem('liked_movies', JSON.stringify(favoriteMovies));
    getFavoritesPreview();
}

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const url = entry.target.getAttribute('data-image');
            entry.target.setAttribute('src', url)
        }    });
})

const baseImgURL = 'https://image.tmdb.org/t/p/w1280';

let intervalId;
let page = 1;
let maxPage;
const favoriteMovies = [];


export const getTrendingMoviesPreview = async function  getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day?', {
        params: {
            language: lang
        }
    });
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

export function getFavoritesPreview() {
    const favoriteMovies = JSON.parse(localStorage.getItem('liked_movies'));

    if(favoriteMovies && favoriteMovies.length > 0) {
        renderMoviesList(favoritesMoviesContainer, favoriteMovies, { lzLoad: true, clean: true})
    } else {
        favoritesMoviesContainer.innerHTML = '';
        const message = document.createElement('p');
        message.classList.add('title');
        message.innerText = 'Aun no tienes favoritos agregados';
        message.style.width = '100vw';
        message.style.textAlign = 'center';
        favoritesMoviesContainer.appendChild(message)
    }
}

export const getResultSearchMovies = async function getResultSearchMovies(query) {
    const { data } = await api('search/movie', {
        params: { query }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    if(movies.length === 0){
        searchPreviewContainer.innerHTML = '';
        const notFoundText = document.createElement('h1');
        notFoundText.classList.add('title');
        notFoundText.textContent = 'No se han encontrado resultados.';
        notFoundText.style.width = '100vw';
        searchPreviewContainer.appendChild(notFoundText)
    }else{
        resultSearchLabel.textContent = searchInput.value;
        renderMoviesList(generalMoviesContainer, movies, { lazyLoad: true, clean: true});
    }
}

export const getTrendingMovies = async function getTrendingMovies() {
    const { data } = await api('trending/movie/day?');
    const movies = data.results;

    maxPage = data.total_pages;
    generalTitle.innerText = 'Trending';
    
   renderMoviesList(generalMoviesContainer, movies, { lazyLoad: true, clean: true});

}

async function  getMoviesByCategories(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        }
    });
    const movies = data.results;

    maxPage = data.total_pages;
    renderMoviesList(generalMoviesContainer, movies, { lzLoad: true, clean:false});
}

async function getPaginatedMovies(path, {idCategory = null, query = null} ={}) {
    const scrollIsBottom = handleScroll();
    const pageIsNotmax = page < maxPage;

    if (scrollIsBottom && pageIsNotmax) {

      page++;
      const { data } = await api(path, {
        params: {
          page: page,
          with_genres: idCategory,
          query: query,
        },
      });

      const movies = data.results;
      renderMoviesList(generalMoviesContainer, movies, {
        lzLoad: true,
        clean: false,
      });
    }
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

function renderMoviesList(
        container, 
        movies, 
        { 
            lzLoad=false, 
            clean=true 
        } = {}) {
    if(clean) { 
        container.innerHTML = '';
    } 

    movies.map(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.classList.remove('loader');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute( 
            lzLoad ? 'data-image': 'src', 
            movie.poster_path ? baseImgURL + movie.poster_path : '../src/img/movie-poster-template-03.jpg'
        )

        const likeButton = document.createElement('button');
        const starIcon = document.createElement('i');
        likeButton.classList.add('movie-btn');
        starIcon.classList.add('fa-solid', 'fa-star');
        validateButtonLike(starIcon, movie);
        likeButton.appendChild(starIcon);
        movieContainer.appendChild(likeButton);

        likeButton.addEventListener('click', () => {
            starIcon.classList.toggle('btn-primary');
            starIcon.classList.toggle('btn-secondary');
            saveFavoriteMovie(movie);
        })

        if(lzLoad) {
           lazyLoader.observe(movieImg);
        }

        const titleMovie = document.createElement('p');
        titleMovie.textContent = movie.title;

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(titleMovie)
        container.appendChild(movieContainer);

        movieImg.addEventListener('click', () => {
            detailMovie(movie.id);
            location.hash = `#movie=${movie.id}`
        });
         
    });
}

function validateButtonLike(icon, movie) {
    const favoriteMoviesList = favoritesMoviesList();

    if(favoriteMoviesList && favoriteMoviesList.find(item => item.id === movie.id)){
        icon.classList.add('btn-primary');
    }else {
        icon.classList.add('btn-secondary');
    }
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

function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    return (scrollTop + clientHeight) >= scrollHeight - 15;
}

getTrendingMoviesPreview();
getCategoriesPreview();
getFavoritesPreview();

export const getPaginatedTradeMovies = () => getPaginatedMovies('trending/movie/day?');
export const getPaginatedSearchMovies = (query) => getPaginatedMovies('search/movie', {query})
export const getPaginatedMoviesByCategories = (id) => getPaginatedMovies('discover/movie', { with_genres: id});
