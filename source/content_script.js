var zoom = scriptOptions.zoom;

var contentStoreBaseWidth = 200;
var baseWidth = 150;
var baseHeight = 160;
var pictureSize = 100;
var leftPos = 30;

var adjust = adjust = (baseWidth * zoom) - (pictureSize * zoom) - leftPos;
adjust = adjust < 30 ? 0 : adjust;


// Workarea zoom methods
function replaceImageUrls(parent) {
  $(parent).find("div.card-wrap-large div.card-picture").each(function(){
    var background = $(this).css('background-image');
    background = background.replace('SmallThumbnail', 'Preview');
    $(this).css('background-image', background);
  });
}

// This observer allows to swap the SmallThumbnail for the Preview image when new
// entity cards are loaded are drag and dropped between the split workareas
var observerWorkarea = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == 'childList') {
      if (mutation.addedNodes.length >= 1) {
        if (mutation.addedNodes[0].nodeName == 'DIV' && 
           (mutation.addedNodes[0].className == 'card-section-wrap' || mutation.addedNodes[0].className == 'entity-card-view' || mutation.addedNodes[0].className == '')) {
          replaceImageUrls(mutation.addedNodes[0]);
        }
      }
    }
  });
});


// Content Store zoom methods
function replaceImageUrlsContentStore(parent) {
  $(parent).find("div.item-picture-frame div").each(function(){
    var background = $(this).css('background-image');
    
    if(background.indexOf("?width=200&height=200") > 0) {
      background = background.replace("?width=200&height=200", "");
    }
    else {
      var imageConfig = background.match(/url\(.+\/api\/assetstorage\/.+\/(.*)"\).*/)[1];
      background = background.replace(imageConfig, "Original");
    }
    
    $(this).css('background-image', background);
  });
}

// This observer allows to swap replace the image URL of the picture
// frames when new ones are added to the page.
var observerContentStore = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == 'childList') {
      if (mutation.addedNodes.length >= 1) {
        if (mutation.addedNodes[0].nodeName == 'LI' && 
            mutation.addedNodes[0].className == 'item-wrap') {
          replaceImageUrlsContentStore(mutation.addedNodes[0]);
        }
      }
    }
  });
});

// If the style element doesn't exists, do initial setup
if(!$("#zoomstyle").length) {
  $("<style id=\"zoomstyle\">").appendTo("head");
  
  var observerConfig = { childList: true, subtree: true };
  
  // Version of iPMC prior to update 2018-10-16 and for 6.3 on-premise
  if($('#workarea-container').length > 0) {
    replaceImageUrls('#workarea-container');
      
    var targetNode = document.getElementById('workarea-container');
    observerWorkarea.observe(targetNode, observerConfig);
  }
  // Update of iPMC (2018-10-17)
  else if($('#workarea-root-container').length > 0) {
    replaceImageUrls('#workarea-root-container');
      
    var targetNode = document.getElementById('workarea-root-container');
    observerWorkarea.observe(targetNode, observerConfig);
  }
  else if($('#items-list-wrap').length > 0) {
    replaceImageUrlsContentStore('#items-list');
    
    var targetNode = document.getElementById('items-list');
    observerContentStore.observe(targetNode, observerConfig);
  }
}

var styleEl = $("#zoomstyle");
styleEl.text(".search-result-full:not(.search-result-container-small) div.card-wrap-large { width:" + baseWidth * zoom + "px; height:" + baseHeight * zoom + "px; } .search-result-full:not(.search-result-container-small) div.card-wrap-large div.card-picture { width: " + (pictureSize * zoom + adjust) + "px; height: " + (pictureSize * zoom + adjust) + "px; } li.item-wrap { width: " + contentStoreBaseWidth * zoom + "px; } div.item-picture-frame, div.item-picture-frame div {width: " + contentStoreBaseWidth * zoom + "px; height: " + contentStoreBaseWidth * zoom + "px; }");