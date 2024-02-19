import Browser from "webextension-polyfill";

//background.js
Browser.action.onClicked.addListener((tab) => {
  Browser.tabs.query({ active: true, currentWindow: true }).then((activeTab) => {
    Browser.tabs.sendMessage(activeTab[0].id!, { type: "popup-modal" });
  });
});