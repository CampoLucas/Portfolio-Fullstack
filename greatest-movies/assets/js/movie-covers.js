document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the track and the template
    const track = document.getElementById("carousel-track");
    const template = document.getElementById("movie-cover-template");

    if (!track || !template) {
        console.error("Carousel track or movie-cover-template not found.");
        return;
    }

    if (!Array.isArray(movies)) {
        console.error("movies array is not available. Check movies.js and script order.");
        return;
    }

    // 2. Loop through all movies and render them from the template
    movies.forEach((movie) => {
        // Clone the template content
        const fragment = template.content.cloneNode(true);
        const cover = fragment.querySelector(".cover");
        const img = fragment.querySelector("img");
        const titleEl = fragment.querySelector(".title");
        const yearEl = fragment.querySelector(".release-year");

        // Fill values
        if (cover) cover.href = movie.url || "#";
        if (img) img.src = movie.img;
        if (titleEl) titleEl.textContent = movie.title;
        if (yearEl) yearEl.textContent = movie.year;

        // Append to the carousel track
        track.appendChild(fragment);
    });

    console.log(`Rendered ${movies.length} movies into the carousel.`);
});
