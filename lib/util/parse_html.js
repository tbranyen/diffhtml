var DOMParser = window.DOMParser;
var parser = new DOMParser();

function parseHTML(nodeName, markup) {
  var dom = parser.parseFromString(markup, 'text/html');

  if (nodeName === 'HTML') {
    return dom.documentElement;
  }
  else if (nodeName === 'HEAD') {
    return dom.documentElement.querySelector('head');
  }
  else if (nodeName === 'BODY') {
    return dom.documentElement.querySelector('body');
  }

  return dom.documentElement.querySelector('body').firstChild;
}

module.exports = parseHTML;
