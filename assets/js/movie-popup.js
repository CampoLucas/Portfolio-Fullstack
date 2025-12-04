document.addEventListener("DOMContentLoaded", () => {

    // grab all the movie covers already in your HTML
    const covers = document.querySelectorAll(".carousel-track .cover");

    // grab modal + template elements
    const modal = document.getElementById("movie-modal");
    const modalBody = document.getElementById("movie-modal-body");
    const closeBtn = document.querySelector(".movie-close");
    const template = document.getElementById("movie-popup-template");

    function renderMoviePopup(movie) {
        // clone the <template> content
        const clone = template.content.cloneNode(true);

        // fill in the data
        const imgEl = clone.querySelector(".movie-popup-image");
        const titleEl = clone.querySelector(".movie-popup-title");
        const yearEl = clone.querySelector(".movie-popup-year");
        const descEl = clone.querySelector(".movie-popup-description");

        if (imgEl) {
            imgEl.src = movie.image;
            imgEl.alt = movie.title;
        }
        if (titleEl) {
            titleEl.textContent = movie.title;
        }
        if (yearEl) {
            yearEl.textContent = movie.year;
        }
        if (descEl) {
            descEl.textContent = movie.description;
        }

        return clone;
    }

    // open modal when a cover is clicked
    covers.forEach(cover => {
        cover.addEventListener("click", (e) => {
            e.preventDefault();

            const id = cover.getAttribute("href").substring(1);
            const movie = movieData[id];
            if (!movie) return;

            // clear previous content
            modalBody.innerHTML = "";

            // insert new content based on the template
            const popupContent = renderMoviePopup(movie);
            modalBody.appendChild(popupContent);

            // show modal
            modal.inert = false;
            modal.classList.add("show");
        });
    });

    // close modal when clicking the X
    closeBtn.addEventListener("click", () => {
        modal.inert = true;
        modal.classList.remove("show");
    });

    // close when clicking outside the popup content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.inert = true;
            modal.classList.remove("show");
        }
    });

    // close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            modal.inert = true;
            modal.classList.remove("show");
        }
    });

});
