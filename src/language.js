import { selectContainLanguaje } from "./nodes.js";
import { getTrendingMoviesPreview, getCategoriesPreview, getFavoritesPreview } from "./main.js";
export let lang = navigator.language;

const languages = [
    {
    "iso_639_1": "en",
    "english_name": "English",
    "name": "English"
    },
    {
    "iso_639_1": "fr",
    "english_name": "French",
    "name": "français"
    },
    {
    "iso_639_1": "de",
    "english_name": "German",
    "name": "Deutsche"
    },
    {
    "iso_639_1": "it",
    "english_name": "Italian",
    "name": "Italiano"
    },
    {
    "iso_639_1": "zh",
    "english_name": "Chinese",
    "name": "漢語"
    },
    {
    "iso_639_1": "es",
    "english_name": "Spanish",
    "name": "Español"
    },
]

export function createLanguages(){
    selectContainLanguaje.innerText = ''
    languages.forEach(language=>{
        let optionLanguage = document.createElement('option');
        optionLanguage.name = language.english_name;
        optionLanguage.innerText = language.name;
        optionLanguage.value = language.iso_639_1;

        selectContainLanguaje.appendChild(optionLanguage)
    })
    selectContainLanguaje.addEventListener('change', (e)=>{
        console.log(e.target)
                lang = e.target.value
                console.log(lang)
                getTrendingMoviesPreview ()
                getCategoriesPreview ()
                getFavoritesPreview()
    })
}