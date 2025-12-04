document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carousel-track");
    buildCovers(track, movies); // build HTML once
    initCarousel(track); // attach movement logic
})

function buildCovers(track, data) {
    track.innerHTML = "";
    const pool = [];


    data.forEach(m => {
        const el = renderCover(m);
        pool.push(el);
        track.appendChild(el);
    });

    // save the pool reference in track dataset for later reuse
    track._pool = pool;
    track._active = pool.slice(); // current visible elements
}

// render a single movie into a <a> element
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

// update an existing cover's content from a movie object
function assignMovieData(cover, m){
    cover.href = m.url;

    const img = cover.querySelector("img");
    img.src = m.img;
    img.alt = m.title;

    cover.querySelector(".title").textContent = m.title;
    cover.querySelector(".release-year").textContent = m.year;
    cover.querySelector(".genre").textContent = m.genre;

    // if extreaHTML exists, update or insert
    const extraContainer = cover.querySelector(".extra-html");
    if (extraContainer) extraContainer.innerHTML = m.extraHtml || "";
}

function initCarousel(track) {
    const leftBtn = document.querySelector(".scroll-btn.left");
    const rightBtn = document.querySelector(".scroll-btn.right");
    const wrapper = document.querySelector(".carousel-wrapper");

    let isMoving = false;
    let hasScrolled = false;
    let startIndex = 0;

    const totalMovies = movies.length;
    const covers = track._pool;

    function getVisibleCount() {
        const item = track.querySelector(".cover");
        const style = getComputedStyle(item);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        const itemWidth = item.offsetWidth + margin;
        const viewportWidth = track.parentElement.offsetWidth;

        return Math.floor(viewportWidth / itemWidth);
    }

    function getShiftAmount() {
        const item = track.querySelector(".cover");
        const style = getComputedStyle(item);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

        return (item.offsetWidth + margin) * getVisibleCount();
    }

    // get next movie index circularly
    function nextIndex(idx, dir){
        const step = dir === "right" ? 1 : -1;
        return (idx + step + totalMovies) % totalMovies;
    }

    // assign new movies to reused elements when cyvling
    function updateCovers(dir) {
        const count = getVisibleCount();

        if (dir === "right") {
            // recycle first n covers, move to end and update data
            for (let i = 0; i < count; i++) {
                const cover = track.firstElementChild;
                startIndex = nextIndex(startIndex, "right");
                const movieIndex = (startIndex + covers.length - 1) % totalMovies;
                assignMovieData(cover, movies[movieIndex]);
                track.appendChild(cover);
            }
        } else {
            // recyvle last n covers, move to front and update data
            for (let i = 0; i < count; i++) {
                const cover = track.lastElementChild;
                startIndex = nextIndex(startIndex, "left");
                const movieIndex = (startIndex - count + totalMovies) % totalMovies;
                assignMovieData(cover, movies[movieIndex]);
                track.prepend(cover);
            }
        }
    }

    function move(dir){
        if (isMoving) return;
        isMoving = true;

        const shift = getShiftAmount();

        if (!hasScrolled) {
            hasScrolled = true;
            wrapper.classList.add("active-left");
            leftBtn.classList.add("show");
        }

        track.style.transition = "transform 0.5s ease";
        track.style.transform = `translateX(${dir === "right" ? -shift : shift}px)`;

        track.addEventListener("transitionend",
            () => {
                track.style.transition = "none";
                track.style.transform = "translateX(0)";
                updateCovers(dir);
                isMoving = false;
            },
            { once: true }
        );
    }

    rightBtn.addEventListener("click", () => move("right"));
    leftBtn.addEventListener("click", () => move("left"));
}