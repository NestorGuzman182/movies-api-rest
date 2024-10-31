import { getCategoriesPreview, getTrendingMoviesPreview, getResultSearchMovies } from './main.js'
import { trendingView, controlsBtn, 
    hero, categoriesSection, movieSection, searchMoviesSection,
    searchInput, 
    searchButton, backButton, 
    trendingPreviewContainer} from './nodes.js';

searchButton.addEventListener('click', () => location.hash = `search=${searchInput.value}`);
backButton.addEventListener('click', () => history.back());

export const init = window.addEventListener('DOMContentLoaded', navigator, false);
export const change = window.addEventListener('hashchange', navigator, false);


function navigator() {
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
}

function homePage() {
    controlsBtn.classList.add('inactive');
    hero.classList.remove('inactive');
    trendingView.style.textAlign = 'left';
    trendingView.classList.remove('inactive');
    trendingPreviewContainer.classList.remove('trending-list');
    categoriesSection.classList.remove('inactive');
    movieSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoryPage() {
    controlsBtn.classList.remove('inactive');
    trendingView.classList.add('inactive');
}
function movieDetailPage() {
    controlsBtn.classList.remove('inactive');
    movieSection.classList.remove('inactive');
    trendingView.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    searchMoviesSection.classList.add('inactive')
}
function searchPage() {
    controlsBtn.classList.remove('inactive');
    trendingView.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    movieSection.classList.add('inactive')
    searchMoviesSection.classList.remove('inactive');

    const [_, query] = location.hash.split('=');
    getResultSearchMovies(query);
}
function trendsPage() {
    controlsBtn.classList.remove('inactive');
    hero.classList.add('inactive');
    trendingView.style.textAlign = 'center';
    trendingPreviewContainer.classList.add('trending-list');
    categoriesSection.classList.add('inactive');
}