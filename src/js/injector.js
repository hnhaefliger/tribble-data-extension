listener = document.createElement('script');
listener.src = chrome.runtime.getURL('js/listener.js');
listener.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(listener);

window.addEventListener('message', (e) => {
    if (typeof(e.data) == 'string') {
        switch (e.data.split(' ')[0]) {
            case 'listener':
                chrome.runtime.sendMessage(e.data);
                break;
        }
    }
});