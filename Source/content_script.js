var mappings = {
  ":co:":       "https://robertsspaceindustries.com/media/khu6mwy8zo5sar/icon/Consolidated_outland.png",
  ":aegis:":    "https://robertsspaceindustries.com/media/1apfbr0v0vbnur/icon/Aegis.png",
  ":anvil:":    "https://robertsspaceindustries.com/media/w0o33qmdai9wpr/icon/Anvil.png",
  ":banu:":     "https://robertsspaceindustries.com/media/3ktltnm6ph4cfr/icon/Banu.png",
  ":crusader:": "https://robertsspaceindustries.com/media/c83tyi4pwogrnr/icon/Crusader.png",
  ":drake:":    "https://robertsspaceindustries.com/media/bdkpvl2bpxaqar/icon/Drake.png",
  ":esperia:":  "https://robertsspaceindustries.com/media/ofli1kgpqq5y6r/icon/Vanduul.png",
  ":kruger:":   "https://robertsspaceindustries.com/media/4u3vwg26y1wm3r/icon/Kruger.png",
  ":misc:":     "https://robertsspaceindustries.com/media/6irnix69d4a8rr/icon/MISC.png",
  ":origin:":   "https://robertsspaceindustries.com/media/0ffygmebwd3t1r/icon/Origin.png",
  ":rsi:":      "https://robertsspaceindustries.com/media/tb6ui8j38wwscr/icon/RSI.png",
  ":vanduul:":  "https://robertsspaceindustries.com/media/ofli1kgpqq5y6r/icon/Vanduul.png",
  ":xian:":     "https://robertsspaceindustries.com/media/p8niedyslwh6kr/icon/Xian.png",

  ":monocle:":  "https://robertsspaceindustries.com/media/f4w3rd1nhkc5pr/heap_infobox/TIMES-Logo.png",
  ":avocado:":  "https://robertsspaceindustries.com/media/6juj9eab23ml0r/heap_note/AVOCADO-Thumbnail.png",
  ":fault:":    "https://robertsspaceindustries.com/media/qin1oeldb3u9er/heap_infobox/Avatar.png"
};

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

  // Modify each text node's value
  while (node = walker.nextNode()) {
    handleText(node);
  }
}

function handleText(textNode) {
  var parent = textNode.parentNode;
  if (textNode.nodeValue.match(/:\w+:/) && ! parent.getAttribute("data-text")) {
    parent.innerHTML = replaceText(parent.innerHTML);
  }
}

function replaceText(v)
{

  for (var key in mappings) {
    v = v.replace(key, '<span style=\'width: 16px; height: 16px; display: inline-block; background-image: url("' + mappings[key] + '"); background-size: 16px 16px;\'> </span>')
  };

  return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
              // Replace the text for text nodes
              handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
