document.addEventListener('DOMContentLoaded', (event) => {
    // Existing code to disable context menu, drag and drop, and certain keyboard shortcuts

    // Function to prevent default behavior on touch events for iOS
    function preventLongPressMenuOniOS(element) {
        let touchStartTimer;

        element.addEventListener('touchstart', (e) => {
            // Start a timer on touchstart
            touchStartTimer = setTimeout(() => {
                // If the touch lasts longer than 500ms, prevent the default action
                // Assuming a long press intended for copying/saving
                e.preventDefault();
            }, 500); // 500ms threshold for long press
        }, {passive: false});

        element.addEventListener('touchend', (e) => {
            // Clear the timer on touchend to prevent the default action from being blocked on short taps
            clearTimeout(touchStartTimer);
        });

        element.addEventListener('touchmove', (e) => {
            // Clear the timer if the user moves their finger, indicating scrolling or swiping
            clearTimeout(touchStartTimer);
        });
    }


    // Apply the iOS long press prevention to specific elements
    document.querySelectorAll('.portfolio-gallery, #portfolio-modal, img').forEach(element => {
        preventLongPressMenuOniOS(element);
    });

    // Function to show and hide the error notification
    function showErrorNotification() {
        const notification = document.getElementById('error-notification');
        notification.classList.replace('hidden', 'visible');

        // Hide the notification after 4 seconds
        setTimeout(() => {
            notification.classList.replace('visible', 'hidden');
        }, 4000);
    }

    // Modify the existing event listeners to call showErrorNotification on event prevention
    document.querySelector('.portfolio-gallery').addEventListener('contextmenu', e => {
        e.preventDefault();
        showErrorNotification();
    });
    document.getElementById('portfolio-modal').addEventListener('contextmenu', e => {
        e.preventDefault();
        showErrorNotification();
    });
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => {
            e.preventDefault();
            showErrorNotification();
        });
    });
    document.body.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c')) {
            e.preventDefault();
            showErrorNotification();
        }
    });
});
