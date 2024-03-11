document.addEventListener('DOMContentLoaded', (event) => {
    // Disable context menu on entire portfolio gallery and modal
    document.querySelector('.portfolio-gallery').addEventListener('contextmenu', e => e.preventDefault());
    document.getElementById('portfolio-modal').addEventListener('contextmenu', e => e.preventDefault());

    // Disable drag and drop on all images within the portfolio and modal
    document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
});

    // Additional protection to disable copying or saving through keyboard shortcuts and other interactions
    document.body.addEventListener('keydown', function(e) {
    // Disable 'Ctrl + S', 'Ctrl + P', 'Ctrl + C', and other potential shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c')) {
    e.preventDefault();
}
});
});