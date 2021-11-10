chrome.runtime.onInstalled.addListener((e) => {
  resetSession();
});

chrome.runtime.onMessage.addListener((e) => {
  handleMessage(e);
});

chrome.tabs.onActivated.addListener((e) => {
  saveTabData(e.tabId);
});

chrome.tabs.onUpdated.addListener((e) => {
  saveTabData(e);
});

function updatePopup(scope='display') {
  chrome.runtime.sendMessage('update ' + scope);
}

function resetSession() {
  chrome.storage.local.set({sessionName: ''});
  chrome.storage.local.set({sessionDescription: '',});
  chrome.storage.local.set({sessionData: 'Recorded data:',});
  chrome.storage.local.set({sessionState: 'idle'});
}

function saveTabData(tabId) {
  chrome.tabs.get(tabId, (e) => {
    if (e.url) {
      chrome.storage.local.get(['sessionState', 'sessionData'], (data) => {
        if (data.sessionState === 'running' && e.url !== data.sessionData.split('\n').pop()) {
          chrome.storage.local.set({sessionData: data.sessionData + '\n' + e.url}, () => {
            updatePopup(scope='data')
          });
        }
      });
    }
  });
}

function handleMessage(message) {
  if (message === 'start') {
    chrome.storage.local.set({sessionState: 'running'}, () => {
      updatePopup();
    });
  } else {
    if (message === 'end') {
      chrome.storage.local.set({sessionState: 'pending'}, () => {
        updatePopup();
      });
    } else {
      if (message === 'reset') {
        // send data to server

        chrome.storage.local.set({sessionState: 'idle'}, () => {
          resetSession();
          updatePopup();
        });
      }
    }
  }
}