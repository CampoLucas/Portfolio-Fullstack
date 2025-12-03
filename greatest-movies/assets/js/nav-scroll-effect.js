(function(){
    const nav = document.querySelector('.topnav');
    if(!nav) return;

    function updateNav(){
        if(window.scrollY > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
    
    window.addEventListener('scroll', updateNav, { passive: true });
    document.addEventListener('DOMContentLoaded', updateNav);
    updateNav();
})();