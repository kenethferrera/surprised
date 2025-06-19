document.addEventListener('DOMContentLoaded', () => {
    const birthdayCards = document.querySelectorAll('.birthday-card');
    const countdownSection = document.getElementById('countdown-section');
    const birthdayCardsContainer = document.querySelector('.birthday-cards-container');
    const mainHeader = document.querySelector('.main-header'); 

    // Easter Egg Elements
    const easterEgg = document.getElementById('easter-egg');
    const easterEggPopup = document.getElementById('easter-egg-popup');
    const closePopup = document.getElementById('close-popup');
    const easterEggVideo = easterEggPopup.querySelector('video');

    // Easter Egg Click Handler
    easterEgg.addEventListener('click', () => {
        easterEggPopup.classList.remove('hidden');
        easterEggVideo.play();
    });

    // Close Popup Handler
    closePopup.addEventListener('click', () => {
        easterEggPopup.classList.add('hidden');
        easterEggVideo.pause();
        easterEggVideo.currentTime = 0;
    });

    // Close popup when clicking outside the video
    easterEggPopup.addEventListener('click', (e) => {
        if (e.target === easterEggPopup) {
            easterEggPopup.classList.add('hidden');
            easterEggVideo.pause();
            easterEggVideo.currentTime = 0;
        }
    });

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    // Background Music element
    const backgroundMusic = document.getElementById('background-music');

    // Add click event listener to document body
    document.body.addEventListener('click', (event) => {
        // Check if click is outside any birthday card
        const isClickOutside = !event.target.closest('.birthday-card');
        if (isClickOutside) {
            deactivateAllActiveElements();
        }
    });

    // Set countdown to June 20, 2025 (fixed date, does NOT reset on reload)
    const targetDate = new Date(2025, 5, 20, 0, 0, 0); // Month is 0-indexed, so 5 for June

    // --- Background music volume set to -50 dB (approx. 0.00316 on 0-1 scale) ---
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // Very low volume as requested
    }

    // --- Attempt to play background music on first user interaction ---
    let musicStarted = false; // Flag to ensure music plays only once
    function tryPlayBackgroundMusic() {
        if (backgroundMusic && !musicStarted) {
            backgroundMusic.play().then(() => {
                console.log("Background music started successfully on user interaction.");
                musicStarted = true; // Set flag to true
                // Remove the event listener after successful play to avoid redundant calls
                document.body.removeEventListener('click', tryPlayBackgroundMusic);
                document.body.removeEventListener('touchstart', tryPlayBackgroundMusic);
            }).catch(error => {
                console.warn("Background music play still prevented after interaction:", error);
                // Keep the listener if it's still prevented, hoping for a stronger interaction
            });
        }
    }

    // Add event listeners to the body for common user interactions
    document.body.addEventListener('click', tryPlayBackgroundMusic);
    document.body.addEventListener('touchstart', tryPlayBackgroundMusic); // For touch devices


    // --- Centralized function to deactivate all active elements ---
    function deactivateAllActiveElements() {
        birthdayCards.forEach(c => {
            c.classList.remove('active');
            const video = c.querySelector('video');
            if (video && video.tagName === 'VIDEO') {
                video.pause();
                video.currentTime = 0; // Reset video
            }
        });
    }

    // --- Function to switch to message mode (show cards, hide countdown) ---
    function switchToMessageMode() {
        countdownSection.classList.add('hidden'); // Hide countdown
        
        // Show the main header and the birthday cards container
        if (mainHeader) { 
            mainHeader.classList.remove('hidden'); 
        }
        if (birthdayCardsContainer) {
            birthdayCardsContainer.classList.remove('hidden'); 
        }

        // Change background music after countdown
        if (backgroundMusic) {
            backgroundMusic.src = "music/bg_birthday.mp3";
            backgroundMusic.volume = 0.2;
            backgroundMusic.load();
            backgroundMusic.play().catch(error => {
                console.warn("bg_birthday music autoplay prevented after countdown:", error);
            });
        }
    }


    function updateCountdown() {
        const currentTime = new Date().getTime();
        const timeLeft = targetDate.getTime() - currentTime;

        if (timeLeft <= 0) {
            // Countdown has finished or already passed
            switchToMessageMode();
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        } else {
            // Countdown is still running, update display
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            daysSpan.textContent = String(days).padStart(2, '0');
            hoursSpan.textContent = String(hours).padStart(2, '0');
            minutesSpan.textContent = String(minutes).padStart(2, '0');
            secondsSpan.textContent = String(seconds).padStart(2, '0');
        }
    }

    // Initial check when the page loads
    updateCountdown();
    // Only set up interval if countdown is not yet finished
    if (targetDate.getTime() > new Date().getTime()) {
        countdownInterval = setInterval(updateCountdown, 1000);
    } else {
        // If the date has passed, show the messages/cards
        switchToMessageMode();
    }


    // Card interactivity logic
    if (birthdayCardsContainer) { 
        birthdayCards.forEach(card => {
            card.addEventListener('click', () => {
                if (!birthdayCardsContainer.classList.contains('hidden')) {
                    const wasActive = card.classList.contains('active');
                    
                    deactivateAllActiveElements(); // Deactivate everything first

                    if (!wasActive) { // If this card was NOT active, activate it
                        card.classList.add('active');
                        const video = card.querySelector('video');
                        if (video && video.tagName === 'VIDEO') {
                            video.volume = 0.5; // Set video volume to 0.5 when played
                            video.play();
                        }
                    }
                }
            });
        });
    }

    // Easter Egg Wiggle Animation Every 5 Seconds
    setInterval(() => {
        if (easterEgg) {
            easterEgg.classList.add('wiggle');
            setTimeout(() => {
                easterEgg.classList.remove('wiggle');
            }, 600); // Match animation duration
        }
    }, 5000);

});