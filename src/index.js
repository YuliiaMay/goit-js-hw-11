import './css/styles.css';
import ImgApiService from './js/img-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
};


const imgApiService = new ImgApiService();
let searchQuery = '';

// --------------------------------------------

// --------------------------------------------

refs.form.addEventListener('submit', onSearchImg);
refs.loadBtn.addEventListener('click', onLoadMoreImg);


function onSearchImg(e) {
    e.preventDefault();
    

    imgApiService.query = e.currentTarget.elements.searchQuery.value;

    if (imgApiService.query === '') {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    imgApiService.resetPage();

    imgApiService.fetchImg()
        .then(hits => {
            clearArticlesContainer();
            appendArticlesMarkup(hits);
            simplelightbox.refresh();
            refs.loadBtn.classList.remove('is-hidden');

            scrollPage();
            // gallarySlider.refresh();
        });
};


function onLoadMoreImg() {
    imgApiService.fetchImg()
        .then(hits => {
            appendArticlesMarkup(hits)
            scrollPage();
            simplelightbox.refresh();            
        });
    
    // gallarySlider.refresh();
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

const simplelightbox = new SimpleLightbox('gallery a', {
    overlayOpacity: 0.9,
    captionsData: "alt",
    captionDelay: 250,
    animationSpeed: 500,
});


function scrollPage() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};