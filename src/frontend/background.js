
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('contest-')) {
    const alarmId = alarm.name;
    
    const storage = await chrome.storage.local.get(alarmId);
    const contestData = storage[alarmId];

    if (contestData) {
      chrome.notifications.create(alarmId, {
        type: 'basic',
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 
        title: 'Contest Starting Soon!',
        message: `${contestData.title} starts in 15 minutes on ${contestData.platform}.`,
        priority: 2,
        buttons: [
          { title: 'Open Contest Link' }
        ],
        requireInteraction: true 
      });
    }
  }
});

chrome.notifications.onButtonClicked.addListener(async (notifId, btnIdx) => {
  if (btnIdx === 0) {
    const storage = await chrome.storage.local.get(notifId);
    if (storage[notifId]?.url) {
      chrome.tabs.create({ url: storage[notifId].url });
    }
  }
});

chrome.notifications.onClosed.addListener((notificationId) => {
  if (notificationId.startsWith('contest-')) {
    chrome.storage.local.remove(notificationId);
    console.log("Cleanup: Removed storage for", notificationId);
  }
});