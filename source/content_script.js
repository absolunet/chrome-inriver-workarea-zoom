var zoom = scriptOptions.zoom;

var baseWidth = 150;
var baseHeight = 160;
var pictureSize = 100;
var leftPos = 30;

var adjust = adjust = (baseWidth * zoom) - (pictureSize * zoom) - leftPos;
adjust = adjust < 30 ? 0 : adjust;

function replaceImageUrls(parent) {
  $(parent).find("div.card-wrap-large div.card-picture").each(function(){
    var background = $(this).css('background-image');
    background = background.replace('SmallThumbnail', 'Preview');
    $(this).css('background-image', background);
  });
}

// This observer allows to swap the SmallThumbnail for the Preview image when new
// entity cards are loaded are drag and dropped between the split workareas
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == 'childList') {
      if (mutation.addedNodes.length >= 1) {
        if (mutation.addedNodes[0].nodeName == 'DIV' && 
           (mutation.addedNodes[0].className == 'card-section-wrap' || mutation.addedNodes[0].className == '')) {
          replaceImageUrls(mutation.addedNodes[0]);
        }
      }
    }
  });
});

// If the style element doesn't exists, do initial setup
if(!$("#zoomstyle").length) {
  $("<style id=\"zoomstyle\">").appendTo("head");
  replaceImageUrls('#workarea-container');
  
  var observerConfig = { childList: true, subtree: true };
  var targetNode = document.getElementById('workarea-container');
  observer.observe(targetNode, observerConfig);
}

var styleEl = $("#zoomstyle");
styleEl.text(".search-result-full:not(.search-result-container-small) div.card-wrap-large { width:" + baseWidth * zoom + "px; height:" + baseHeight * zoom + "px; } .search-result-full:not(.search-result-container-small) div.card-wrap-large div.card-picture { width: " + (pictureSize * zoom + adjust) + "px; height: " + (pictureSize * zoom + adjust) + "px; }");