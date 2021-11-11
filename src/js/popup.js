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
  console.log(e);
  chrome.storage.local.set({'sessionName': sessionName.value});
});

sessionDescription.addEventListener('input', (e) => {
  chrome.storage.local.set({'sessionDescription': sessionDescription.value});
});

sessionStart.addEventListener('click', (e) => {
  e.preventDefault();

  switch (sessionState){
    case 'idle':
      chrome.runtime.sendMessage('start');
      break;

    case 'running':
      chrome.runtime.sendMessage('end');
      break;

    case 'pending':
      chrome.runtime.sendMessage('reset');
      break;
  }
});

sessionCancel.addEventListener('click', (e) => {
  e.preventDefault();

  if (sessionState === 'pending') {
    chrome.runtime.sendMessage('cancel');
  }
});

chrome.runtime.onMessage.addListener((e) => {
  handleMessage(e);
});

function handleMessage(message) {
  message = message.split(' ');

  switch (message[0]) {
    case 'update':
      switch (message[1]) {
        case 'display':
          updateDisplay();
          break;

        case 'data':
          updateData();
          break;
      }
      break;
  }
}

function updateDisplay() {
  chrome.storage.local.get(['sessionState', 'sessionName', 'sessionDescription', 'sessionData'], function(result) {
    sessionName.value = result.sessionName;
    sessionDescription.value = result.sessionDescription;
    sessionData.innerHTML = result.sessionData;
    sessionData.scrollTop = sessionData.scrollHeight;
    sessionState = result.sessionState

    switch (sessionState) {
      case 'idle':
        sessionIcon.classList.add('ion-ios-barcode-outline');
        sessionStart.innerHTML = 'Start session';
        cancelSection.classList.add('hidden');
        dataSection.classList.add('hidden');
        break;

      case 'running':
        sessionIcon.classList.add('ion-ios-eye-outline');
        sessionStart.innerHTML = 'End session';
        cancelSection.classList.add('hidden');
        dataSection.classList.remove('hidden');
        break;

      case 'pending':
        sessionIcon.classList.add('ion-ios-cloud-upload-outline');
        sessionStart.innerHTML = 'Confirm submission';
        cancelSection.classList.remove('hidden');
        dataSection.classList.remove('hidden');
        break;
    }
  });
}

function updateData() {
  chrome.storage.local.get(['sessionData'], function(result) {
    sessionData.innerHTML = result.sessionData;
  });
}

updateDisplay();