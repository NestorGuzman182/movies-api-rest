import { getCategoriesPreview, getTrendingMoviesPreview, 
         getResultSearchMovies, getTrendingMovies,
        getPaginatedTradeMovies, getPaginatedMoviesByCategories , getPaginatedSearchMovies
} from './main.js'
import { 
    trendingMenu, categoryMenu, trendingView, 
    controlsBtn, searchInput, searchButton, backButton,
    hero, categoriesSection, movieSection, searchMoviesSection,
    viewMoreTradesMovies,
    trendingPreviewContainer, generalSection,
    favoriteSection
} from './nodes.js';

searchButton.addEventListener('click', () => location.hash = `search=${searchInput.value}`);
backButton.addEventListener('click', () => history.back());
viewMoreTradesMovies.addEventListener('click', () => location.hash = 'trends')
let infiniteScroll;

export const init = window.addEventListener('DOMContentLoaded', navigator, false);
export const change = window.addEventListener('hashchange', navigator, false);
export const infiniteScrolling = window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailPage();
    } else if (location.hash.startsWith('#category=')) {
        categoryPage();
    } else {
        homePage();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
   /*  console.log(infiniteScroll) */
    if(infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll);
    }
}

function homePage() {
    controlsBtn.classList.add('inactive');
    hero.classList.remove('inactive');
    trendingView.style.textAlign = 'left';
    trendingView.classList.remove('inactive');
    trendingPreviewContainer.classList.remove('trending-list');
    categoriesSection.classList.remove('inactive');
    movieSection.classList.add('inactive');
    generalSection.classList.add('inactive');
    favoriteSection.classList.remove('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoryPage() {
    generalSection.classList.add('inactive');
    hero.classList.add('inactive');
    controlsBtn.classList.remove('inactive');
    trendingView.classList.add('inactive');
    categoriesSection.classList.remove('inactive');
    generalSection.classList.remove('inactive');
    favoriteSection.classList.add('inactive');
    movieSection.classList.add('inactive');

    infiniteScroll = getPaginatedMoviesByCategories;
}

function movieDetailPage() {
    hero.classList.add('inactive');
    controlsBtn.classList.remove('inactive');
    movieSection.classList.remove('inactive');
    trendingView.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    searchMoviesSection.classList.add('inactive');
    generalSection.classList.add('inactive');
    favoriteSection.classList.add('inactive');
}

function searchPage() {
    hero.classList.add('inactive');
    controlsBtn.classList.remove('inactive');
    trendingView.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    movieSection.classList.add('inactive')
    searchMoviesSection.classList.remove('inactive');
    generalSection.classList.remove('inactive');
    favoriteSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getResultSearchMovies(query);
    console.log(query)
    infiniteScroll = () => getPaginatedSearchMovies(query);
}

function trendsPage() {
    controlsBtn.classList.remove('inactive');
    hero.classList.add('inactive');
    trendingView.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    trendingView.style.textAlign = 'center';
    generalSection.classList.remove('inactive');
    favoriteSection.classList.add('inactive');
    movieSection.classList.add('inactive');

    getTrendingMovies();
    infiniteScroll = getPaginatedTradeMovies;
}

trendingMenu.addEventListener('click', trendsPage);
categoryMenu.addEventListener('click', categoryPage);