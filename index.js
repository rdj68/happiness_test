scrollingElement = (document.scrollingElement || document.body);

function scrollToBottom() {
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function scrollToTop(id) {
    scrollingElement.scrollTop = 0;
}

const navbar = document.getElementById("navbar");
const sticky = navbar.offsetTop;

function onScroll() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

window.onscroll = onScroll();