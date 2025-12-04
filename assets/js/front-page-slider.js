(function(){
    const slides = [
        { src: './assets/media/movies/the-shining/front01.jpg', title: 'The Shining' },
        { src: './assets/media/movies/the-shining/front02.jpg', title: 'The Shining' },
        { src: './assets/media/movies/the-shining/front03.jpg', title: 'The Shining' },
        { src: './assets/media/movies/the-shining/front04.jpg', title: 'The Shining' },
        { src: './assets/media/movies/the-shining/front05.jpg', title: 'The Shining' },
        { src: './assets/media/movies/rocketman/front01.jpg', title: 'Rocketman' },
        { src: './assets/media/movies/rocketman/front02.jpg', title: 'Rocketman' },
        { src: './assets/media/movies/rocketman/front03.jpg', title: 'Rocketman' },
        { src: './assets/media/movies/rocketman/front04.jpg', title: 'Rocketman' },
        { src: './assets/media/movies/back-to-the-future/front01.jpg', title: 'Back To The Future' },
        { src: './assets/media/movies/back-to-the-future/front02.jpg', title: 'Back To The Future' },
        { src: './assets/media/movies/back-to-the-future/front03.jpg', title: 'Back To The Future' },
        { src: './assets/media/movies/django/front01.jpg', title: 'Django' },
        { src: './assets/media/movies/django/front02.jpg', title: 'Django' },
        { src: './assets/media/movies/django/front03.jpg', title: 'Django' },
        { src: './assets/media/movies/ford-v-ferrari/front01.jpg', title: 'Forc v Ferrari' },
        { src: './assets/media/movies/ford-v-ferrari/front02.jpg', title: 'Forc v Ferrari' },
        { src: './assets/media/movies/ford-v-ferrari/front03.jpg', title: 'Forc v Ferrari' },
        { src: './assets/media/movies/ford-v-ferrari/front04.jpg', title: 'Forc v Ferrari' },
    ];

    function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

    document.addEventListener('DOMContentLoaded', function(){
        const front = document.getElementById('front-page-slider');
        if(!front) return;

        const chosen = pickRandom(slides);
        front.style.backgroundImage = `url("${chosen.src}")`;
        const movieEl = document.getElementById('front-page-movie');

        if(movieEl){
            movieEl.textContent = chosen.title;
        }
    });
})();

