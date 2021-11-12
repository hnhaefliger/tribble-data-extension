scrollTimer = -1;
resizeTimer = -1;


document.addEventListener('scroll', (e) => {
    onScroll();
});

window.addEventListener('resize', (e) => {
    onResize();
});


function sendScroll() {
    window.postMessage({
        action: 'record',
        data: 'scroll ' + window.scrollX + ' ' + window.scrollY,
        receiver: 'tribble_data_injector',
        sender: 'tribble_data_listener',
    });
}

function onScroll() {
    if (scrollTimer != -1) {
        clearTimeout(scrollTimer);
    }
    
    scrollTimer = window.setTimeout(sendScroll, 500);
}

function sendWindowSize() {
    window.postMessage({
        action: 'record',
        data: 'window ' + window.innerWidth + ' ' + window.innerHeight,
        receiver: 'tribble_data_injector',
        sender: 'tribble_data_listener',
    });
}

function onResize() {
    if (resizeTimer != -1) {
        clearTimeout(resizeTimer);
    }
    
    resizeTimer = window.setTimeout(sendWindowSize, 500);
}


sendScroll();
sendWindowSize();