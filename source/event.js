// This function is called from the popup code
function zoom(value) {
  chrome.tabs.executeScript(null, {file: "jquery-3.3.1.min.js"}, function(){
    chrome.tabs.executeScript(null, {code: "var scriptOptions = {zoom:'"+ value + "'};"}, function(){
      chrome.tabs.executeScript(null, {file: "content_script.js"});
    });
  });
};