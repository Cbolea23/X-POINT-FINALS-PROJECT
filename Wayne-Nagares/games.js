document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handling
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav') || document.querySelector('.navigation');
    const headerEl = document.querySelector('.main-header');

    mobileMenuToggle?.addEventListener('click', () => {
        // toggle a class so CSS controls visibility and transitions
        headerEl?.classList.toggle('nav-open');
    });

    // Newly Released Games Carousel
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const carouselSlider = document.querySelector('.carousel-slider');
    let currentSlide = 0;
    let autoSlideInterval;
    let isPaused = false;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentSlide = index;
        }
    }

    function nextSlide() {
        if (isPaused) return;
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function startAutoSlide() {
        // Clear any existing interval first
        stopAutoSlide();
        // Start fresh interval
        autoSlideInterval = setInterval(nextSlide, 5000); // 5 seconds
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Manual navigation via indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            // Restart the timer from this point
            startAutoSlide();
        });
    });

    // Pause on hover
    if (carouselSlider) {
        carouselSlider.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoSlide();
        });

        carouselSlider.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoSlide();
        });

        // Initialize: show first slide and start auto-sliding
        showSlide(0);
        startAutoSlide();
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

    // ==================== GAME LIBRARY FILTER SYSTEM ====================
    const gameSearch = document.getElementById('gameSearch');
    const gameCards = document.querySelectorAll('.game-card-wrapper');
    const genreButtons = document.querySelectorAll('[data-genre]');
    const consoleButtons = document.querySelectorAll('[data-console]');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const noResults = document.getElementById('noResults');

    let activeGenre = 'all';
    let activeConsole = 'all';

    // Search functionality
    gameSearch?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterGames(searchTerm, activeGenre, activeConsole);
    });

    // Genre filter
    genreButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all genre buttons
            genreButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            activeGenre = button.dataset.genre;
            const searchTerm = gameSearch?.value.toLowerCase() || '';
            filterGames(searchTerm, activeGenre, activeConsole);
        });
    });

    // Console filter
    consoleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all console buttons
            consoleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            activeConsole = button.dataset.console;
            const searchTerm = gameSearch?.value.toLowerCase() || '';
            filterGames(searchTerm, activeGenre, activeConsole);
        });
    });

    // Clear filters
    clearFiltersBtn?.addEventListener('click', () => {
        // Reset search
        if (gameSearch) gameSearch.value = '';
        
        // Reset genre to "All Genres"
        genreButtons.forEach(btn => {
            if (btn.dataset.genre === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Reset console to "All Consoles"
        consoleButtons.forEach(btn => {
            if (btn.dataset.console === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        activeGenre = 'all';
        activeConsole = 'all';
        filterGames('', 'all', 'all');
    });

    // Main filter function
    function filterGames(searchTerm, genre, console) {
        let visibleCount = 0;

        gameCards.forEach(card => {
            const gameName = card.dataset.name.toLowerCase();
            const gameGenres = card.dataset.genre.split(' ');
            const gameConsoles = card.dataset.console.split(' ');

            // Check search match
            const matchesSearch = searchTerm === '' || gameName.includes(searchTerm);

            // Check genre match
            const matchesGenre = genre === 'all' || gameGenres.includes(genre);

            // Check console match
            const matchesConsole = console === 'all' || gameConsoles.includes(console);

            // Show/hide card based on all filters
            if (matchesSearch && matchesGenre && matchesConsole) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide "no results" message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }
});