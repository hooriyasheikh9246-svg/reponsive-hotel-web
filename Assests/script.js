document.addEventListener('DOMContentLoaded', () => {
    
    // Set Logical Default Check Dates (Today & Tomorrow)
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const heroIn = document.getElementById('hero-checkin');
    const heroOut = document.getElementById('hero-checkout');
    const formIn = document.getElementById('form-checkin');
    const formOut = document.getElementById('form-checkout');

    if(heroIn && heroOut) {
        heroIn.min = today; heroIn.value = today;
        heroOut.min = tomorrow; heroOut.value = tomorrow;
    }
    if(formIn && formOut) {
        formIn.min = today; formIn.value = today;
        formOut.min = tomorrow; formOut.value = tomorrow;
    }

    // Connect Top Floating Widget to Form Data Pipeline
    const quickCheckForm = document.getElementById('quick-check-form');
    quickCheckForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(formIn && heroIn) formIn.value = heroIn.value;
        if(formOut && heroOut) formOut.value = heroOut.value;
        
        const selectedLoc = document.getElementById('hero-location-select').value;
        const mainLocSelect = document.getElementById('form-location');
        if(mainLocSelect) mainLocSelect.value = selectedLoc;

        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });

    // Frontend Submission Validation Mock UI
    const mainForm = document.getElementById('main-inquiry-form');
    
    /* NOTE: If using Formspree/Web3Forms, delete the code block below 
       so the native 'action' parameter executes fully without restriction.
    */
    mainForm.addEventListener('submit', (e) => {
        // If testing local feedback loops without a processor connected:
        if (mainForm.getAttribute('action') === 'YOUR_FORM_ENDPOINT') {
            e.preventDefault();
            const clientName = document.getElementById('form-name').value;
            alert(`Inquiry recorded for ${clientName}! connect a valid processing gateway endpoint inside the HTML action parameter to start routing inquiries to your live devices.`);
        }
    });

    // --- Mobile Navigation Toggle (hamburger menu) ---
    const menuToggle = document.getElementById('menu-toggle');
    const siteNavbar = document.getElementById('site-navbar');

    if (menuToggle && siteNavbar) {
        menuToggle.addEventListener('click', () => {
            const isOpen = siteNavbar.classList.toggle('nav-open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close the mobile menu automatically once a nav link is tapped
        siteNavbar.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                siteNavbar.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on resize back to desktop width
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                siteNavbar.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});



// --- Premium Horizontal Scroll & Lightbox Gallery Controller ---
document.addEventListener('DOMContentLoaded', () => {
    const scrollOuter = document.querySelector('.gallery-scroll-outer');
    const scrollTrack = document.getElementById('interactive-scroll-track');
    const progressBar = document.getElementById('scroll-progress-indicator');
    const btnNext = document.querySelector('.btn-next');
    const btnPrev = document.querySelector('.btn-prev');

    if (!scrollOuter || !scrollTrack) return;

    // 1. Smooth Progress Indicator Update Tracking
    const updateProgressBar = () => {
        const maxScrollLeft = scrollOuter.scrollWidth - scrollOuter.clientWidth;
        if (maxScrollLeft <= 0) return;
        const scrollPercentage = (scrollOuter.scrollLeft / maxScrollLeft) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    };

    scrollOuter.addEventListener('scroll', updateProgressBar);
    window.addEventListener('resize', updateProgressBar);

    // 2. Control Button Click Actions
    const cardStepWidth = 410; // Baseline card width + grid gap spacing
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            scrollOuter.scrollBy({ left: cardStepWidth, behavior: 'smooth' });
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            scrollOuter.scrollBy({ left: -cardStepWidth, behavior: 'smooth' });
        });
    }

    // 3. Immersive Mouse Drag-To-Scroll Mechanics
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollOuter.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollOuter.classList.add('active');
        startX = e.pageX - scrollOuter.offsetLeft;
        scrollLeft = scrollOuter.scrollLeft;
    });

    scrollOuter.addEventListener('mouseleave', () => {
        isDown = false;
    });

    scrollOuter.addEventListener('mouseup', () => {
        isDown = false;
    });

    scrollOuter.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollOuter.offsetLeft;
        const walk = (x - startX) * 1.5; // Controls drag tracking velocity coefficient multiplier
        scrollOuter.scrollLeft = scrollLeft - walk;
    });

    // 4. Fullscreen Lightbox Popover Controller
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-main-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeTrigger = document.querySelector('.close-lightbox-trigger');
    const galleryCards = document.querySelectorAll('.premium-gallery-card');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.querySelector('img').src;
            const imgTitle = card.querySelector('h3').innerText;
            const imgLoc = card.querySelector('.img-category').innerText;

            lightboxImg.src = imgSrc;
            lightboxCaption.innerText = `${imgTitle} — ${imgLoc}`;
            lightbox.style.display = "block";
            document.body.style.overflow = "hidden"; // Disables background window page shifting
        });
    });

    const deactivateLightbox = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    };

    closeTrigger.addEventListener('click', deactivateLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) deactivateLightbox();
    });

    // Handle Escape button keyboard closures
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && lightbox.style.display === "block") deactivateLightbox();
    });

    // Initialize progress meter default values on load
    updateProgressBar();
});