document.addEventListener('DOMContentLoaded', (event) => {
    // Existing code to disable context menu, drag and drop, and certain keyboard shortcuts

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
