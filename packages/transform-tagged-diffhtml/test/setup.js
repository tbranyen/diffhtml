'use strict';

const Document = require('stringdom');

// Set up a pretend DOM for the tests.
global.document = new Document();
global.document.body = document.createElement('body');

const elementPrototype = global.document.createElement('div').__proto__;

// Do not simulate event system.
global.CustomEvent = class CustomEvent {};
elementPrototype.dispatchEvent = () => {};

// Make innerText return all text nodes concat + trim.
Object.defineProperty(elementPrototype, 'innerText', {
  get() {
    var retVal = '';

    function findAllText(childNode) {
      if (childNode.nodeType === 3) {
        retVal += childNode.data || '';
      }
      else {
        childNode.childNodes.forEach(findAllText);
      }
    }

    findAllText(this);

    return retVal.trim();
  }
});

// Ensure (request|cancel)AnimationFrame is a thing.
global.requestAnimationFrame = fn => setTimeout(fn, 10);
global.cancelAnimationFrame = timeout => clearTimeout(timeout);
