// ---------------------------IMPORT------------------------------------
import axios from 'axios';


// ---------------------------EXPORT------------------------------------
axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '33500508-b4271a177ba3ac813eaf35292&q';
const PARAM = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ImgApiService {    
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImg() {
        try {
            const response = await axios.get(`/?key=${API_KEY}&q=${this.searchQuery}&${PARAM}&per_page=40&page=${this.page}`);
            this.incrementPage();
            return response;
        } catch (err) {
            console.log(err);
        } 
    }
    
    resetPage() {
        this.page = 1;
    }

    incrementPage() {
        this.page += 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
};




