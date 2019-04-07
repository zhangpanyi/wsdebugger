chrome.browserAction.onClicked.addListener(function (tab) {
  var url = 'chrome-extension://' + chrome.runtime.id + '/index.html';
  chrome.tabs.create({url: url});
});