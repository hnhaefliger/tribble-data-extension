injectListener();

window.addEventListener('message', (e) => {
    if (e.data.receiver === 'tribble_data_injector') {
        handleWindowMessage(e);
    }
});

function handleWindowMessage(message) {
    switch (message.data.action) {
        case 'record':
        chrome.runtime.sendMessage({
            action: 'record',
            data: message.data.data,
            receiver: 'tribble_data_background',
            sender: 'tribble_data_injector',
        });
        break;
    }
}

function injectListener() {
    listener = document.createElement('script');
    listener.src = chrome.runtime.getURL('js/listener.js');
    listener.onload = () => {
        listener.remove();
    };

    (document.head || document.documentElement).appendChild(listener);
}