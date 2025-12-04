document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');
    const wrapper = document.querySelector('.carousel-wrapper');

    let isMoving = false;
    let hasScrolled = false;
    let index = 0;

    const items = Array.from(track.children);
    const total = items.length;

    // duplicate the list once to allow smooth looping
    items.forEach(el => track.appendChild(el.cloneNode(true)));

    function getVisibleCount() {
        const item = track.querySelector('.cover');
        const style = getComputedStyle(item);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        const itemWidth = item.offsetWidth + margin;
        const viewportWidth = track.parentElement.offsetWidth;
        return Math.floor(viewportWidth / itemWidth);
    }

    function getShiftAmount() {
        const item = track.querySelector('.cover');
        const style = getComputedStyle(item);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        return (item.offsetWidth + margin) * getVisibleCount();
    }

    function move(dir) {
        if (isMoving) return;
        isMoving = true;
        const shift = getShiftAmount();

        if (!hasScrolled) {
        hasScrolled = true;
        wrapper.classList.add('active-left');
        leftBtn.classList.add('show');
        }

        index = (index + (dir === 'right' ? 1 : -1) + total) % total;

        const moveBy = dir === 'right' ? -shift : shift;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${moveBy}px)`;

        track.addEventListener(
        'transitionend',
        () => {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';

            // logically rotate children
            if (dir === 'right') {
            for (let i = 0; i < getVisibleCount(); i++) {
                track.appendChild(track.firstElementChild);
            }
            } else {
            for (let i = 0; i < getVisibleCount(); i++) {
                track.prepend(track.lastElementChild);
            }
            }

            isMoving = false;
        },
        { once: true }
        );
    }

    function moveLeft() {
        if (isMoving) return;
        isMoving = true;

        const count = getVisibleCount();
        const shift = getShiftAmount();

        // Clone the last visible covers and prepend them before animating
        const items = Array.from(track.children);
        const clones = items.slice(items.length - count).map(el => el.cloneNode(true));

        // Prepend clones in reverse so visual order stays correct
        for (let i = clones.length - 1; i >= 0; i--) {
            track.insertBefore(clones[i], track.firstElementChild);
        }

        // Instantly offset left so clones are off-screen
        track.style.transition = 'none';
        track.style.transform = `translateX(${-shift}px)`;
        void track.offsetWidth; // force reflow

        // Animate back to zero – this slides the new clones into view smoothly
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = 'translateX(0)';

        // After animation, remove the temporary clones and move originals
        track.addEventListener(
            'transitionend',
            () => {
            track.style.transition = 'none';

            // Remove temporary clones
            clones.forEach(c => track.removeChild(c));

            // Move the real last covers to the front to keep logical order
            const current = Array.from(track.children);
            for (let i = 0; i < count; i++) {
                track.prepend(current[current.length - 1 - i]);
            }

            track.style.transform = 'translateX(0)';
            isMoving = false;
            },
            { once: true }
        );
    }

    rightBtn.addEventListener('click', () => move('right'));
    leftBtn.addEventListener('click', () => moveLeft());
});

