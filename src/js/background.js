chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({sessionName: ''});
  chrome.storage.local.set({sessionDescription: '',});
  chrome.storage.local.set({sessionData: 'Recorded data:',});
  chrome.storage.local.set({sessionState: 'idle'});
});