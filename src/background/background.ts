import Browser from "webextension-polyfill";

//background.js
// If you want to open as a pop-up
// Browser.action.onClicked.addListener((tab) => {
//   Browser.tabs.query({ active: true, currentWindow: true }).then((activeTab) => {
//     Browser.tabs.sendMessage(activeTab[0].id!, { type: "popup-modal" });
//   });
// });

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));