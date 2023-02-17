// ---------------------------IMPORT------------------------------------
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';




// ---------------------------EXPORT------------------------------------
axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '33500508-b4271a177ba3ac813eaf35292&q';
const PARAM = 'image_type=photo&orientation=horizontal&safesearch=true';


export default class ImgApiService {
// class ImgApiService {    
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }


    async fetchImg() {
        
        const URL = `/?key=${API_KEY}&q=${this.searchQuery}&${PARAM}&per_page=40&page=${this.page}`
        const response = await axios.get(`/?key=${API_KEY}&q=${this.searchQuery}&${PARAM}&per_page=40&page=${this.page}`);

        return fetch(URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }

                return response.json();
            })
            .then(hits => {
                // console.log(hits.hits.length);
                // console.log(hits.totalHits);
                this.incrementPage();

                if (hits.totalHits > 0) {
                    Notify.info(`Hooray! We found ${hits.totalHits} images.`);
                }
                

                // if(hits.totalHits === )
                // const totalNumberImg = [];
                // const currentNumberImg = hits.hits.length;
                    
                // totalNumberImg.push(currentNumberImg);

                // console.log(totalNumberImg);

                return hits;
            })        
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




