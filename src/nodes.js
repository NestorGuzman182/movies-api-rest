const $ = (id) => document.querySelector(id) ;


export const categoriesSection = $('#categories-preview');
export const movieSection = $('.movie-detail');
export const searchMoviesSection = $('#search-preview');
export const generalSection = $('#general-container');

//list and containers
export const searchForm = $('#search-form');
export const controlsBtn = $('.controls');
export const hero = $('#hero');
export const trendingPreviewContainer = $('#trending-preview .slider-container');
export const categoriesPreviewContainer = $('#categories-preview .categories-list');
export const searchPreviewContainer = $('#search-preview .search-list');
export const movieDetailCategoriesList = $('#movie-detail .categories-list');
export const generalMoviesContainer = $('#general-container .general-list')
export const trendingView = $('.trending-container');
export const detailMovieContainer = $('.info-movie');
export const similarMoviesContainer = $('.similar-movies'); 

//elements
export const searchButton = $('#search-button');
export const searchInput = $('#input-form');
export const backButton = $('#back-btn');
export const categoryLabel = $('#category-name');
export const resultSearchLabel = $('#search-name');
export const viewMoreTradesMovies = $('#see-all-btn');
export const generalTitle = $('#general-title');