document.addEventListener('DOMContentLoaded', (event) => {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, .portfolio-item'));
    const elementPositions = elements.map(el => {
        const rect = el.getBoundingClientRect();
        return window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    }).sort((a, b) => a - b);

    let isScrolling = false;

    const smoothScrollToElement = (index) => {
        if (index < 0 || index >= elementPositions.length || isScrolling) return;
        isScrolling = true;
        window.scrollTo({
            top: elementPositions[index],
            behavior: 'smooth'
        });
        setTimeout(() => {
            isScrolling = false;
        }, 800); // Adjust time based on scroll duration
    };

    let currentIndex = 0;
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        const direction = e.deltaY > 0 ? 1 : -1;
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = 0;
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else if (currentIndex >= elementPositions.length) {
            currentIndex = elementPositions.length - 1;
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
        } else {
            smoothScrollToElement(currentIndex);
        }
    });
});