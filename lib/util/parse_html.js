var DOMParser = window.DOMParser || function() {};
var parser = new DOMParser();

function parseHTML(markup) {
  return parser.parseFromString(markup, 'text/html').documentElement;
}

module.exports = parseHTML;
