document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            // Small delay for fade in if we wanted to add opacity transitions
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });
    }

    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});
