window.addEventListener('DOMContentLoaded', function(){
    const pagetop_btn = document.getElementById('rocket');;
    pagetop_btn.addEventListener("click", scroll_top);
    function scroll_top() {
        pagetop_btn.style.position = "fixed";
        window.scroll({ top: 0, behavior: "smooth" });
        pagetop_btn.animate({opacity: [1, 0], transform: ["translateY(800px)", "translateY(-1300px)"]}, 1200);
        pagetop_btn.style.overflow = "visible";
    }
    window.addEventListener("scroll", scroll_event);
    function scroll_event() {
        if (window.pageYOffset < 50) {
            pagetop_btn.style.position = "absolute";
            pagetop_btn.style.overflow = "hidden";
        } 
    }
});