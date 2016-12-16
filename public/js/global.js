
/* global ConversationPanel: true, PayloadPanel: true*/
/* eslint no-unused-vars: "off" */

// Other JS files required to be loaded first: apis.js, conversation.js, payload.js
(function() {
  //alert("global");
  // Initialize all modules
  ConversationPanel.init();
  ConversationResponse.init();
  Media.init();
  PayloadPanel.init();
})();
