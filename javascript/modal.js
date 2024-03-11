
var currentIndex = 0; // Track the current index of the portfolio item
var isModalOpen = false; // Track the state of the modal

function openModal(item) {
    var portfolioItems = document.getElementsByClassName('portfolio-item');
    currentIndex = Array.from(portfolioItems).indexOf(item);
    isModalOpen = true; // Modal is now open
    updateModalContent(currentIndex);
    updateNavigationIcons(currentIndex);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Lock scrolling
}

function updateModalContent(index) {
    var portfolioItems = document.getElementsByClassName('portfolio-item');
    var image = portfolioItems[index].getElementsByTagName('img')[0];
    var description = portfolioItems[index].getElementsByClassName('portfolio-description')[0].innerText;
    var modalImage = document.getElementById('modal-image');
    var modalDescription = document.getElementById('modal-description');

    modalImage.style.opacity = '0';
    modalDescription.style.opacity = '0';

    modalImage.src = image.src;
    modalDescription.innerText = description;

    setTimeout(function() {
        modalImage.style.opacity = '1';
        modalImage.style.transform = 'translate(-50%, -50%) scale(1)';
        modalDescription.style.opacity = '1';
        modalDescription.style.transform = 'translate(-50%, -50%)';
    }, 10);

    document.getElementById('portfolio-modal').style.display = "block";
}

function updateNavigationIcons(index) {
    var portfolioItems = document.getElementsByClassName('portfolio-item');
    document.querySelector('.nav-icon.left').style.display = index > 0 ? "block" : "none";
    document.querySelector('.nav-icon.right').style.display = index < portfolioItems.length - 1 ? "block" : "none";
}

function navigate(direction) {
    var portfolioItems = document.getElementsByClassName('portfolio-item');
    var modalImage = document.getElementById('modal-image');
    var modalDescription = document.getElementById('modal-description');
    var newIndex = currentIndex + direction;

    // Choose animation direction based on the navigation direction
    var enterAnimation = direction > 0 ? 'modal-animation-enter' : 'modal-animation-enter-reverse';
    var exitAnimation = direction > 0 ? 'modal-animation-exit' : 'modal-animation-exit-reverse';

    // Wrap-around logic
    if (newIndex < 0) {
        newIndex = portfolioItems.length - 1; // Go to last if moving left from first
    } else if (newIndex >= portfolioItems.length) {
        newIndex = 0; // Go to first if moving right from last
    }

    // Apply exit animation
    modalImage.classList.add(exitAnimation);
    modalDescription.classList.add(exitAnimation);

    setTimeout(() => {
        currentIndex = newIndex;

        // Update content without animation, reset to starting position
        updateModalContentWithoutAnimation(currentIndex); // Update this function as needed
        updateNavigationIcons(currentIndex);

        // Apply enter animation
        modalImage.classList.remove(exitAnimation);
        modalDescription.classList.remove(exitAnimation);
        modalImage.classList.add(enterAnimation);
        modalDescription.classList.add(enterAnimation);

        // Clean up enter animation to allow for subsequent navigations
        setTimeout(() => {
            modalImage.classList.remove(enterAnimation);
            modalDescription.classList.remove(enterAnimation);
        }, 450); // Match the duration of the CSS animation
    }, 450); // Wait for the exit animation to complete
}


function updateModalContentWithoutAnimation(index) {
    var portfolioItems = document.getElementsByClassName('portfolio-item');
    var image = portfolioItems[index].getElementsByTagName('img')[0];
    var description = portfolioItems[index].getElementsByClassName('portfolio-description')[0].innerText;
    var modalImage = document.getElementById('modal-image');
    var modalDescription = document.getElementById('modal-description');

    // Directly update the src and innerText without triggering opacity or transform animations
    modalImage.src = image.src;
    modalDescription.innerText = description;

    // Ensure any existing animation classes are removed to reset the state
    modalImage.classList.remove('modal-animation-enter', 'modal-animation-exit', 'modal-animation-enter-reverse', 'modal-animation-exit-reverse');
    modalDescription.classList.remove('modal-animation-enter', 'modal-animation-exit', 'modal-animation-enter-reverse', 'modal-animation-exit-reverse');

    // Since we're bypassing the standard animation pathways, ensure display is correctly set
    document.getElementById('portfolio-modal').style.display = "block";
}




function closeModal() {
    isModalOpen = false; // Modal is now closed
    document.getElementById('portfolio-modal').style.display = "none";
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = ''; // Unlock scrolling
}






function handleKeyDown(event) {
    if (!isModalOpen) return;

    switch (event.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
        case '6': // Numpad 6
        case ' ': // Space bar for next item
            navigate(1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case '4': // Numpad 4
            navigate(-1);
            break;
        // Add other keys if needed
    }

    // Prevent default action for navigation keys and space bar
    if (['ArrowUp', 'ArrowDown', ' ', 'w', 'W', 's', 'S', '8', '2'].includes(event.key)) {
        event.preventDefault();
    }
}

// Variables to store the start and end points of a touch
let touchStartX = 0;
let touchEndX = 0;

// Function to handle the start of a touch
function handleTouchStart(event) {
    // Get the first touch point
    const firstTouch = event.touches[0];
    // Set the start X position
    touchStartX = firstTouch.clientX;
}

// Function to handle the end of a touch
function handleTouchEnd(event) {
    // No need to get the touch point here, as touchend doesn't include TouchList
    touchEndX = event.changedTouches[0].clientX;

    // Determine swipe direction
    const threshold = 50; // Minimum distance for a swipe gesture
    if (touchEndX < touchStartX - threshold) {
        // Swipe left
        navigate(1);
    } else if (touchEndX > touchStartX + threshold) {
        // Swipe right
        navigate(-1);
    }
}

// Adding the event listeners for touch events
document.getElementById('portfolio-modal').addEventListener('touchstart', handleTouchStart, false);
document.getElementById('portfolio-modal').addEventListener('touchend', handleTouchEnd, false);



// Define a variable to track the time of the last navigation action
let lastScrollNavigationTime = 0;

// Optional: Add an event listener for wheel scroll to navigate with throttling
window.addEventListener('wheel', function(event) {
    if (!isModalOpen) return;

    // Get the current time
    const now = Date.now();

    // Check if the required time has passed since the last navigation action
    if (now - lastScrollNavigationTime >= 300) { // 1250 milliseconds for 0.8 item/second
        event.preventDefault(); // Prevent scrolling the page

        // Navigate based on scroll direction
        if (event.deltaY > 0) navigate(1); // Scroll down, go forward
        else if (event.deltaY < 0) navigate(-1); // Scroll up, go back

        // Update the time of the last navigation action
        lastScrollNavigationTime = now;
    }
}, { passive: false }); // Use passive: false to allow preventDefault

