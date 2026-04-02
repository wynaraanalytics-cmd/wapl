document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Advanced Scroll Animations ---
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    // Performance optimized scroll loop
    let lastKnownScrollPosition = 0;
    let ticking = false;

    function doAdvancedScrollTransforms(scrollPos) {
        // 1. Header Glassmorphism Toggle
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }

        // 2. Parallax Hero Scaling (The Digital Pulsar)
        if (heroSection && heroContent) {
            // Only calculate if hero is somewhat in viewport
            if (scrollPos < window.innerHeight) {
                // Subtle scale down and fade out
                const scaleValue = 1 - (scrollPos * 0.0005);
                const opacityValue = 1 - (scrollPos * 0.002);
                const transformY = scrollPos * 0.4; // Slower scroll rate

                // Clamp values to prevent weirdness
                const clampedScale = Math.max(0.85, scaleValue);
                const clampedOpacity = Math.max(0, opacityValue);

                heroContent.style.transform = `translateY(${transformY}px) scale(${clampedScale})`;
                heroContent.style.opacity = clampedOpacity.toFixed(2);
            }
        }
    }

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                doAdvancedScrollTransforms(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Run once on load to establish initial state
    doAdvancedScrollTransforms(window.scrollY);


    // --- Staggered Intersection Observer ---
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15 
            };

            // Group intersecting elements by time so we can stagger them dynamically
            let intersectQueue = [];
            let isProcessingQueue = false;

            const processQueue = () => {
                intersectQueue.sort((a, b) => {
                    // Sort by DOM order roughly (or horizontal position)
                    return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
                });

                intersectQueue.forEach((item, index) => {
                    // Dynamically set transition delay to stagger reveals beautifully
                    item.style.transitionDelay = `${index * 0.15}s`;
                    item.classList.add('active');
                });
                
                intersectQueue = [];
                isProcessingQueue = false;
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        intersectQueue.push(entry.target);
                        observer.unobserve(entry.target); 
                        
                        // Debounce the processing so we group items that appear simultaneously
                        if (!isProcessingQueue) {
                            isProcessingQueue = true;
                            setTimeout(processQueue, 50);
                        }
                    }
                });
            }, observerOptions);

            // Clean up any hardcoded delays from CSS to rely on dynamic JS stagger
            revealElements.forEach(el => {
                el.style.transitionDelay = '0s'; // Reset
                revealObserver.observe(el);
            });
        } else {
            revealElements.forEach(el => el.classList.add('active'));
        }
    }
});
