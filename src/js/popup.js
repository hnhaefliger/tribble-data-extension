sessionIcon = document.getElementById('session-icon');
sessionName = document.getElementById('session-name');
sessionDescription = document.getElementById('session-description');
sessionData = document.getElementById('session-data');
dataSection = document.getElementById('data-section');
sessionStart = document.getElementById('session-start');
sessionCancel = document.getElementById('session-cancel');
cancelSection = document.getElementById('cancel-section');
sessionState = 'idle';

sessionName.addEventListener('input', (e) => {
  chrome.storage.local.set({'sessionName': sessionName.value});
});

sessionDescription.addEventListener('input', (e) => {
  chrome.storage.local.set({'sessionDescription': sessionDescription.value});
});

sessionStart.addEventListener('click', (e) => {
  e.preventDefault();

  if (sessionState === 'idle') {
    chrome.runtime.sendMessage('start');

  } else {
    if (sessionState === 'running') {
      chrome.runtime.sendMessage('end');

    } else {
      if (sessionState === 'pending') {
        chrome.runtime.sendMessage('reset');
      }
    }
  }
});

sessionCancel.addEventListener('click', (e) => {
  e.preventDefault();

  if (sessionState === 'pending') {
    chrome.runtime.sendMessage('reset');
  }
});

chrome.runtime.onMessage.addListener((e) => {
  handleMessage(e);
});

function handleMessage(message) {
  message = message.split(' ');

  if (message[0] === 'update') {
    if (message[1] === 'display') {
      updateDisplay();
    } else {
      if (message[1] === 'data') {
        updateData();
      }
    }
  }
}

function updateDisplay() {
  chrome.storage.local.get(['sessionState', 'sessionName', 'sessionDescription', 'sessionData'], function(result) {
    sessionName.value = result.sessionName;
    sessionDescription.value = result.sessionDescription;
    sessionData.innerHTML = result.sessionData;
    sessionData.scrollTop = sessionData.scrollHeight;
    sessionState = result.sessionState

    if (sessionState === 'idle') {
      sessionIcon.classList.add('ion-ios-barcode-outline');
      sessionStart.innerHTML = 'Start session';
      cancelSection.classList.add('hidden');
      dataSection.classList.add('hidden');

    } else {
      if (sessionState === 'running') {
        sessionIcon.classList.add('ion-ios-eye-outline');
        sessionStart.innerHTML = 'End session';
        cancelSection.classList.add('hidden');
        dataSection.classList.remove('hidden');

      } else {
        if (sessionState === 'pending') {
          sessionIcon.classList.add('ion-ios-cloud-upload-outline');
          sessionStart.innerHTML = 'Confirm submission';
          cancelSection.classList.remove('hidden');
          dataSection.classList.remove('hidden');
        }
      }
    }
  });
}

function updateData() {
  chrome.storage.local.get(['sessionData'], function(result) {
    sessionData.innerHTML = result.sessionData;
  });
}

updateDisplay();