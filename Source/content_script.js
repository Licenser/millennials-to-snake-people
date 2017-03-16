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
    //if (Node.nodeValue == ":monocle:"){
    //console.log("parent:", node.parentNode);
    //}
    handleText(node);
  }
}

function handleText(textNode) {
  var parent = textNode.parentNode;
  if (textNode.nodeValue.match(/:monocle:/)) {
    parent.innerHTML = replaceText(parent.innerHTML);
    //textNode.nodeValue = replaceText(textNode.nodeValue);
  }
}

function replaceText(v)
{
  v = v.replace(/:monocle:/g, '<span style=\'width: 16px; height: 16px; display: inline-block; background-image: url("https://robertsspaceindustries.com/media/f4w3rd1nhkc5pr/heap_infobox/TIMES-Logo.png"); background-size: 16px 16px;\'> </span>');

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
