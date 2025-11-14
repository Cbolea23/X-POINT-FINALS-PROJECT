let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let backButton = document.getElementById('back');
let audioPlayer = document.getElementById('carouselAudio');

nextButton.onclick = function(){
    showSlider('next');
}
prevButton.onclick = function(){
    showSlider('prev');
}
let unAcceppClick;

const updateTheme = () => {
    let activeItem = document.querySelector('.carousel .list .item:nth-child(2)');
    if (!activeItem) return;

    let newTheme = activeItem.dataset.theme;
    let newSound = activeItem.dataset.sound;

    if (newTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    if (newSound === 'sounds/ps1-sound.mp3') {
        document.body.classList.add('ps1-active');
    } else {
        document.body.classList.remove('ps1-active');
    }

    let newColor = activeItem.dataset.color;
    if (newColor) {
        document.body.style.background = newColor;
        carousel.style.setProperty('--carousel-glow', newColor);
    }
}

const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if(type === 'next'){
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    }else{
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }

    let newItems = document.querySelectorAll('.carousel .list .item');
    let activeItem = newItems[1]; 

    let newSound = activeItem.dataset.sound;
    if (newSound && audioPlayer) {
        audioPlayer.src = newSound; 
        audioPlayer.play().catch(e => console.error("Audio play failed:", e));
    }

    updateTheme();

    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(()=>{
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
seeMoreButtons.forEach((button) => {
    button.onclick = function(){
        carousel.classList.remove('next', 'prev');
        carousel.classList.add('showDetail');
    }
});
backButton.onclick = function(){
    carousel.classList.remove('showDetail');
}

updateTheme();