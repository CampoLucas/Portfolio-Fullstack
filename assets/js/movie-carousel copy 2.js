document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carousel-track");
    initCarousel(track, movies);
})

/* 
    initialize carousel
*/

function initCarousel(track, data) {
    const leftBtn = document.querySelector(".scroll-btn.left");
    const rightBtn = document.querySelector(".scroll-btn.right");
    const wrapper = document.querySelector(".carousel-wrapper");

    let isMoving = false;
    let hasScrolled = false;
    let startIndex = 0;

    const pool = { active: [], inactive: [] };

    // initial build
    const visible = getVisibleCount(track, data[0]);
    for (let i = 0; i < visible; i++) {
        const movie = data[(startIndex + i) % data.length];
        const cover = renderCover(movie);
        pool.active.push(cover);
        track.appendChild(cover);
    }

    // main move function
    function move(dir) {
        if (isMoving) return;
        isMoving = true;

        const visibleCount = getVisibleCount(track, pool.active[0]);
        const shift = getShiftAmount(track, pool.active[0]);

        // Show left arrow and remove padding on first scroll
        if (!hasScrolled) {
            hasScrolled = true;
            wrapper.classList.add("active-left");
            leftBtn.classList.add("show");
        }

        // prepare new covers outside viewport
        prepareNext(dir, track, pool, data, startIndex, visibleCount);

        // Force paint before animation
        track.offsetWidth;

        // animate
        requestAnimationFrame(() => {
            track.style.transition = "transform 0.5s ease";
            track.style.transform = `translateX(${dir === "right" ? -shift : shift}px)`;
        })

        // recycle after animation completes
        track.addEventListener(
            "transitionend",
            () => {
                track.style.transition = "none";
                track.style.transform = "translateX(0)";
                recycle(dir, track, pool, data, visibleCount);
                startIndex = updateStartIndex(dir, startIndex, visibleCount, data.length);
                isMoving = false;
            },
            { once: true }
        );
    }

    rightBtn.addEventListener("click", () => move("right"));
    leftBtn.addEventListener("click", () => move("left"));
}

/*
    cover element handling (pool management)
*/

// create a new cover 
function renderCover(m) {
    const a = document.createElement("a");
    a.className = "cover";
    a.href = m.url;
    a.innerHTML = `
        <div class="thumb"><img src="${m.img}" alt="${m.title}"></div>
        <p class="text title">${m.title}</p>
        <p class="text release-year">${m.year}</p>
        <p class="text genre">${m.genre}</p>
        ${m.extraHtml || ""}
    `;
    return a;
}

// update an existing cover’s content from a movie
function assignMovieData(cover, m) {
    cover.href = m.url;
    const img = cover.querySelector("img");
    img.src = m.img;
    img.alt = m.title;
    cover.querySelector(".title").textContent = m.title;
    cover.querySelector(".release-year").textContent = m.year;
    cover.querySelector(".genre").textContent = m.genre;
}

/*
    pool behaviour
*/

// prepare new covers just outside the viewport
function prepareNext(dir, track, pool, data, startIndex, visible) {
    const total = data.length;

    // ensure enough inactive covers
    while (pool.inactive.length < visible) {
        pool.inactive.push(renderCover({ title: "", year: "", img: "", url: "#" }));
    }

    if (dir === "right") {
        // create or reuse covers that will appear to the right
        for (let i = 0; i < visible; i++) {
            const movieIndex = (startIndex + visible + i) % total;
            const movie = data[movieIndex];
            const cover = pool.inactive.shift();
            assignMovieData(cover, movie);
            track.appendChild(cover);
            pool.active.push(cover);
        }
    } else {
        // create or reuse covers that will appear to the left
        for (let i = 0; i < visible; i++) {
            const movieIndex = (startIndex - visible + i + total) % total;
            const movie = data[movieIndex];
            const cover = pool.inactive.shift();
            assignMovieData(cover, movie);
            track.insertBefore(cover, track.firstChild);
            pool.active.unshift(cover);
        }
    }
}

// recycle only the covers that moved off-screen
function recycle(dir, track, pool, visible) {
    if (dir === "right") {
        // move leftmost visibleCount to inactive (now off-screen)
        for (let i = 0; i < visible; i++) {
            const c = pool.active.shift();
            pool.inactive.push(c);
        }
    } else {
        // move rightmost visibleCount to inactive
        for (let i = 0; i < visible; i++) {
            const c = pool.active.pop();
            pool.inactive.push(c);
        }
    }
}

/*
    helpers
*/

function getVisibleCount(track) {
    const item = track.querySelector(".cover");
    if (!item) return 1; // fallback so it never gives an error

    const style = getComputedStyle(item);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    const itemWidth = item.offsetWidth + margin;
    const viewportWidth = track.parentElement.offsetWidth;
    return Math.floor(viewportWidth / itemWidth);
}

function getShiftAmount(track) {
    const item = track.querySelector(".cover");
    if (!item) return 0; // fallback so it never gives an error

    const style = getComputedStyle(item);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return (item.offsetWidth + margin) * getVisibleCount(track);
}

function updateStartIndex(dir, startIndex, visible, total) {
    return dir === "right"
        ? (startIndex + visible) % total
        : (startIndex - visible + total) % total;
}