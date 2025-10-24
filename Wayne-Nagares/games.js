document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handling
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    mobileMenuToggle?.addEventListener('click', () => {
        mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Hero section carousel auto-scroll
    const gamesCarousel = document.querySelector('.games-carousel');
    if (gamesCarousel) {
        setInterval(() => {
            gamesCarousel.scrollBy({
                left: 250,
                behavior: 'smooth'
            });
            if (gamesCarousel.scrollLeft >= gamesCarousel.scrollWidth - gamesCarousel.clientWidth) {
                gamesCarousel.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }, 5000);
    }

    // Sale games slider
    let isAnimating = false;
    const slide = document.getElementById('slide');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');

    function animateSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const lists = document.querySelectorAll('.item');
        if (lists.length < 2) return;

        const duration = 500; // Animation duration in milliseconds

        if (direction === 'next') {
            const firstItem = lists[0];
            firstItem.style.transition = `opacity ${duration}ms ease-out`;
            firstItem.style.opacity = '0';

            setTimeout(() => {
                slide.appendChild(firstItem);
                firstItem.style.opacity = '1';
                firstItem.style.transition = '';
                isAnimating = false;
            }, duration);
        } else {
            const lastItem = lists[lists.length - 1];
            lastItem.style.opacity = '0';
            slide.prepend(lastItem);

            // Force reflow
            lastItem.offsetHeight;

            lastItem.style.transition = `opacity ${duration}ms ease-in`;
            lastItem.style.opacity = '1';

            setTimeout(() => {
                lastItem.style.transition = '';
                isAnimating = false;
            }, duration);
        }
    }

    next.onclick = () => animateSlide('next');
    prev.onclick = () => animateSlide('prev');

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            animateSlide('next');
        } else if (e.key === 'ArrowLeft') {
            animateSlide('prev');
        }
    });

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            animateSlide('next');
        } else if (touchEndX - touchStartX > 50) {
            animateSlide('prev');
        }
    });
});