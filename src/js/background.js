lastTab = '';
sessionData = '';

chrome.storage.local.get(['sessionData', 'sessionTime'], (data) => {
  sessionData = data.sessionData;
});

chrome.runtime.onInstalled.addListener((e) => {
  resetSession();
});

chrome.runtime.onMessage.addListener((e) => {
  handleMessage(e);
});

chrome.tabs.onActivated.addListener((e) => {
  lastTab = e.tabId;
  saveTabData(e.tabId);
});

chrome.tabs.onUpdated.addListener((e) => {
  if (lastTab !== e) {
    saveTabData(e);
  }

  lastTab = e;
});

function updatePopup(scope='display') {
  chrome.runtime.sendMessage('update ' + scope);
}

function resetSession() {
  chrome.storage.local.set({sessionName: ''});
  chrome.storage.local.set({sessionDescription: ''});
  chrome.storage.local.set({sessionState: 'idle'});
  now = new Date();
  chrome.storage.local.set({sessionData: 'start ' + now.getTime()});
  sessionData = 'start ' + now.getTime();
  chrome.storage.local.set({sessionTime: now.getTime()});
}

function updateSessionData(newData, updateTime=true) {
  chrome.storage.local.get(['sessionState', 'sessionTime'], (data) => {
    if (data.sessionState === 'running' && data !== sessionData.split('\n').pop()) {
      if (updateTime) {
        now = new Date();
        sessionData += '\npause ' + (now.getTime() - data.sessionTime);
        chrome.storage.local.set({sessionTime: now.getTime()});
      }
      
      sessionData += '\n' + newData;

      chrome.storage.local.set({sessionData: sessionData}, () => {
        updatePopup(scope='data');
      });
    }
  });
}

function saveTabData(tabId) {
  chrome.tabs.get(tabId, (e) => {
    if (e.url) {
      updateSessionData('url ' + e.url);
    }
  });
}

function saveListenerData(listenerData) {
  updateSessionData(listenerData);
}

function handleMessage(message) {
  message = message.split(' ');

  console.log(message);

  switch (message[0]) {
    case 'start':
      resetSession();
      chrome.storage.local.set({sessionState: 'running'}, () => {
        updatePopup();
      });
      break;

    case 'end':
      chrome.storage.local.set({sessionState: 'pending'}, () => {
        updatePopup();
      });
      break;

    case 'reset':
      saveData();

      resetSession();
      chrome.storage.local.set({sessionState: 'idle'}, () => {
        updatePopup();
      });
      break;

    case 'cancel':
      resetSession();
      chrome.storage.local.set({sessionState: 'idle'}, () => {
        updatePopup();
      });
      break;

    case 'listener':
      saveListenerData(message.slice(1).join(' '));
      break;
  }
}