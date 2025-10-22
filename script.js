// This is the special listener that waits for the entire HTML page to be ready.
// ALL of our JavaScript code should go inside this function.
document.addEventListener('DOMContentLoaded', function() {

    // Wait for the document to be fully loaded

    // Get all filter buttons and all project cards
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-gallery-grid .project-card");

    // Add a click event listener to each button
    filterButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Get the filter value from the clicked button's 'data-filter' attribute
            const filterValue = this.getAttribute("data-filter");

            // --- 1. Update the 'active' class on buttons ---
            
            // Remove 'active' from all buttons
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add 'active' to the *clicked* button
            this.classList.add("active");

            // --- 2. Filter the project cards ---
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                // If filter is "all" OR card category matches filter
                if (filterValue === "all" || cardCategory === filterValue) {
                    card.classList.remove("hide"); // Show the card
                } else {
                    card.classList.add("hide"); // Hide the card
                }
            });
        });
    });
    // --- 1. Smart Sticky Header Logic ---
    const header = document.querySelector('.main-header');
    
    // We check if the header actually exists on the page before trying to use it.
    if (header) { 
        // This functionality is now handled by the CSS :not(.hero-section) selector
        // for better performance, but the JS is kept in case of fallback needs.
    }

    // --- 2. Scroll-Reveal Animation Logic ---
    const revealElements = document.querySelectorAll('.reveal');

    // Only run this code if there are elements with the "reveal" class.
    if (revealElements.length > 0) { 
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // --- 3. Mobile Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav-overlay');

    // Check if the menu elements exist.
    if (menuToggle && mobileNav) { 
        menuToggle.addEventListener('click', () => {
            // Toggle the .is-open class on the overlay
            mobileNav.classList.toggle('is-open');
            // Prevent the body from scrolling when the menu is open
            document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
        });
    }

    // --- 4. Testimonial Slider Logic (Sliding Version) ---
    const slider = document.querySelector('#testimonial-slider');

    // Only run if the slider exists on the page
    if (slider) {
        const track = slider.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        
        // Only run if there's more than one slide
        if (slides.length > 1) {
            let currentIndex = 0;
            const slideInterval = 6000; // Time in milliseconds (6 seconds)

            function moveToNextSlide() {
                // Move to the next slide index, looping back to 0 if at the end
                currentIndex = (currentIndex + 1) % slides.length;

                // Apply the transform to the track to move it horizontally
                track.style.transform = 'translateX(-' + currentIndex * 100 + '%)';
            }
            
            // Start the automatic sliding
            setInterval(moveToNextSlide, slideInterval);
        }
    }

    // --- 5. Project Filtering Logic (NEWLY ADDED) ---
    const filterControls = document.querySelector('.filter-controls');
    
    // Only run the filter logic if the filter buttons exist on the page
    if (filterControls) {
        const projectCards = document.querySelectorAll('.project-card');

        filterControls.addEventListener('click', (e) => {
            // Ensure a button was clicked
            if (e.target.classList.contains('filter-btn')) {
                
                // Remove .active class from the currently active button
                filterControls.querySelector('.active').classList.remove('active');
                
                // Add .active class to the button that was just clicked
                e.target.classList.add('active');

                const filterValue = e.target.getAttribute('data-filter');

                // Loop through all the project cards to show or hide them
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // If the card matches the filter, or the filter is 'all'
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        // We first remove any 'display: none' that might have been set
                        card.style.display = 'inline-block';
                        // Then we remove the 'hidden' class to trigger the opacity transition
                        card.classList.remove('hidden');
                    } else {
                        // If it doesn't match, add the 'hidden' class to fade it out
                        card.classList.add('hidden');
                        
                        // After the fade-out transition is complete, set display to 'none'
                        // so it doesn't take up any space.
                        setTimeout(() => {
                           if(card.classList.contains('hidden')){
                               card.style.display = 'none';
                           }
                        }, 500); // This time should match your CSS transition duration
                    }
                });
            }
        });
    }

}); // This is the closing bracket for our main DOMContentLoaded listener.