sessionIcon = document.getElementById('session-icon');
sessionName = document.getElementById('session-name');
sessionDescription = document.getElementById('session-description');
sessionData = document.getElementById('session-data');
dataSection = document.getElementById('data-section');
sessionStart = document.getElementById('session-start');
sessionCancel = document.getElementById('session-cancel');
cancelSection = document.getElementById('cancel-section');
sessionState = 'idle';

sessionNameWarning = document.getElementById('session-name-warning');
sessionDescriptionWarning = document.getElementById('session-description-warning');

sessionName.addEventListener('input', (e) => {
  checkSessionNameErrors();

  chrome.storage.local.set({'sessionName': sessionName.value});
});

sessionDescription.addEventListener('input', (e) => {
  checkSessionDescriptionErrors();

  sessionDescription.style.height = '1px';
  sessionDescription.style.height = sessionDescription.scrollHeight + 'px';

  chrome.storage.local.set({'sessionDescription': sessionDescription.value});
});

sessionStart.addEventListener('click', (e) => {
  e.preventDefault();

  switch (sessionState){
    case 'idle':
      chrome.runtime.sendMessage({
        action: 'start',
        receiver: 'tribble_data_background',
        sender: 'tribble_data_popup',
      });
      break;

    case 'running':
      chrome.runtime.sendMessage({
        action: 'end',
        receiver: 'tribble_data_background',
        sender: 'tribble_data_popup',
      });
      break;

    case 'pending':
      chrome.runtime.sendMessage({
        action: 'reset',
        receiver: 'tribble_data_background',
        sender: 'tribble_data_popup',
      });
      break;
  }
});

sessionCancel.addEventListener('click', (e) => {
  e.preventDefault();

  if (sessionState === 'pending') {
    chrome.runtime.sendMessage({
      action: 'cancel',
      receiver: 'tribble_data_background',
      sender: 'tribble_data_popup',
    });
  }
});

chrome.runtime.onMessage.addListener((e) => {
  if (e.receiver === 'tribble_data_popup') {
    handleMessage(e);
  }
});

function handleMessage(message) {
  switch (message.action) {
    case 'update':
      switch (message.data) {
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
  chrome.storage.local.get(['sessionState', 'sessionName', 'sessionDescription', 'sessionData'], (data) => {
    sessionName.value = data.sessionName;
    checkSessionNameErrors();

    sessionDescription.value = data.sessionDescription;
    sessionDescription.style.height = '1px';
    sessionDescription.style.height = sessionDescription.scrollHeight + 'px';
    checkSessionDescriptionErrors();

    sessionData.innerHTML = data.sessionData;
    sessionData.scrollTop = sessionData.scrollHeight;
    
    sessionState = data.sessionState

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
  chrome.storage.local.get(['sessionData'], (data) => {
    sessionData.innerHTML = data.sessionData;
  });
}

function checkSessionNameErrors() {
  if (sessionName.value.length < 1) {
    sessionNameWarning.innerHTML = 'Session name must be at least 1 character long.';
    sessionNameWarning.classList.remove('hidden');

  } else if (sessionName.value.length > 128) {
    sessionNameWarning.innerHTML = 'Session name must be no more than 128 characters long.';
    sessionNameWarning.classList.remove('hidden');

  } else {
    sessionNameWarning.classList.add('hidden');
  }
}

function checkSessionDescriptionErrors() {
  if (sessionDescription.value.length < 32) {
    sessionDescriptionWarning.innerHTML = 'Session description must be at least 32 characters long.';
    sessionDescriptionWarning.classList.remove('hidden');

  } else if (sessionDescription.value.length > 512) {
    sessionDescriptionWarning.innerHTML = 'Session description must be no more than 512 characters long.';
    sessionDescriptionWarning.classList.remove('hidden');

  } else {
    sessionDescriptionWarning.classList.add('hidden');
  }
}

updateDisplay();