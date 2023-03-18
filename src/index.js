// --------------------------- IMPORT ------------------------------------
import './css/styles.css';
import ImgApiService from './js/img-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


// -------------------------- VARIABLES ------------------------------------
const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
};


const imgApiService = new ImgApiService();
const simplelightbox = new SimpleLightbox('.gallery a', {
    overlayOpacity: 0.9,
    captionsData: "alt",
    captionDelay: 250,
    animationSpeed: 500,
});

// let searchQuery = '';


// ---------------------------- EVENTS ------------------------------------
refs.form.addEventListener('submit', onSearchImg);
refs.loadBtn.addEventListener('click', fetchImg);


// --------------------------- FUNCTIONS ------------------------------------
function onSearchImg(e) {
    e.preventDefault();
    
    imgApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    if (imgApiService.query === '') {
        Notify.info('Please enter your query.');
        return;
    }

    imgApiService.resetPage();
    clearArticlesContainer();
    fetchImg();
    refs.loadBtn.classList.remove('is-hidden');
};


function fetchImg() {
    imgApiService.fetchImg()
        .then(({ data }) => {
            if (data.total === 0) {
                Notify.failure(`Sorry, there are no images matching your search query: ${imgApiService.query}. Please try again.`);
                refs.loadBtn.classList.add('is-hidden');
                return;
            }

            appendArticlesMarkup(data);
            scrollPage();
            simplelightbox.refresh();

            const { totalHits } = data;

            if (refs.gallery.children.length === totalHits ) {
                Notify.info(`We're sorry, but you've reached the end of search results.`);
                refs.loadBtn.classList.add('is-hidden');
            } else {
                Notify.success(`Hooray! We found ${totalHits} images.`);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function appendArticlesMarkup(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', createGallery(hits));
}

function createGallery({hits}) {
    const galleryMarkup = hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<a class="link-card" href=${largeImageURL}>
                        <div class="photo-card">
                            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                            <div class="info">
                                <p class="info-item">
                                    <b class="info-item-value">Likes</b>
                                    ${likes}
                                </p>
                                <p class="info-item">
                                    <b class="info-item-value">Views</b>
                                    ${views}
                                </p>
                                <p class="info-item">
                                    <b class="info-item-value">Comments</b>
                                    ${comments}
                                </p>
                                <p class="info-item">
                                    <b class="info-item-value">Downloads</b>
                                    ${downloads}
                                </p>
                            </div>
                        </div>
                    </a>`
        })
        .join('');
    
    return galleryMarkup;
}

function clearArticlesContainer() {
    refs.gallery.innerHTML = '';
}

function scrollPage() {
    const { height: cardHeight } = refs.gallery
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 0.5,
        behavior: "smooth",
    });
};