// store data about:
// scrolling
// view time
// input (security?)
// highlighting

scrollTimer = -1;
resizeTimer = -1;


document.addEventListener('scroll', (e) => {
    onScroll();
});

window.addEventListener('resize', (e) => {
    onResize();
});


function sendScroll() {
    window.postMessage('listener scroll ' + window.scrollX + ' ' + window.scrollY, '*');
}

function onScroll() {
    if (scrollTimer != -1) {
        clearTimeout(scrollTimer);
    }
    
    scrollTimer = window.setTimeout(sendScroll, 500);
}

function sendWindowSize() {
    window.postMessage('listener window ' + window.innerWidth + ' ' + window.innerHeight, '*');
}

function onResize() {
    if (resizeTimer != -1) {
        clearTimeout(resizeTimer);
    }
    
    resizeTimer = window.setTimeout(sendWindowSize, 500);
}


sendScroll();
sendWindowSize();