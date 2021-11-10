sessionIcon = document.getElementById('session-icon');
sessionName = document.getElementById('session-name');
sessionDescription = document.getElementById('session-description');
sessionData = document.getElementById('session-data');
sessionStart = document.getElementById('session-start');
sessionState = 'idle';

chrome.storage.local.get(['sessionState', 'sessionName', 'sessionDescription', 'sessionData'], function(result) {
  sessionName.value = result.sessionName;
  sessionDescription.value = result.sessionDescription;
  sessionData.innerHTML = result.sessionData;
  sessionState = result.sessionState

  if (sessionState === 'idle') {
    sessionIcon.classList.add('ion-ios-barcode-outline');
    sessionStart.innerHTML = 'Start session';

  } else {
    if (sessionState === 'running') {
      sessionIcon.classList.add('ion-ios-eye-outline');
      sessionStart.innerHTML = 'End session';

    } else {
      if (sessionState === 'pending') {
        sessionIcon.classList.add('ion-ios-cloud-upload-outline');
        sessionStart.innerHTML = 'Confirm submit';

      }
    }
  }
});

sessionStart.addEventListener('click', (e) => {
  e.preventDefault();

  if (sessionState === 'idle') {
    chrome.storage.local.set({sessionState: 'running'}, () => {
      sessionState = 'running';
      sessionIcon.classList.remove('ion-ios-barcode-outline');
      sessionIcon.classList.add('ion-ios-eye-outline');
      sessionStart.innerHTML = 'End session';
    });

  } else {
    if (sessionState === 'running') {
      chrome.storage.local.set({sessionState: 'pending'}, () => {
        sessionState = 'pending';
        sessionIcon.classList.remove('ion-ios-eye-outline');
        sessionIcon.classList.add('ion-ios-cloud-upload-outline');
        sessionStart.innerHTML = 'Confirm submit';
      });

    } else {
      if (sessionState === 'pending') {
        chrome.storage.local.set({sessionState: 'idle'}, () => {
          sessionState = 'idle';
          sessionIcon.classList.remove('ion-ios-cloud-upload-outline');
          sessionIcon.classList.add('ion-ios-barcode-outline');
          sessionStart.innerHTML = 'Start session';
        });
      }
    }
  }
});