const Document = require('stringdom');

// Set up a pretend DOM for the tests.
global.document = new Document();
global.document.body = document.createElement('body');
global.document.createComment = function() {
  return document.createElement('noscript');
};

// Get access to the Node prototype.
const Node = Object.getPrototypeOf(global.document.body);

// No-op the event functions.
global.CustomEvent = function() {};
Node.dispatchEvent = () => {};

// Copied from a project by Jonathan Neal.
Node.contains = function(node) {
  if (!(0 in arguments)) {
    throw new TypeError('1 argument is required');
  }

  do {
    if (this === node) {
      return true;
    }
  } while (node = node && node.parentNode);

  return false;
};
