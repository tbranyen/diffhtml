# Transitions

## Overview

### Add a transition state callback

Adds a global transition listener.  With many elements this could be an
expensive operation, so try to limit the amount of listeners added if you're
concerned about performance.

Since the callback triggers with various elements, most of which you probably
don't care about, you'll want to filter.  A good way of filtering is to use the
DOM `matches` method.  It's fairly well supported
(http://caniuse.com/#feat=matchesselector) and may suit many projects.  If you
need backwards compatibility, consider using jQuery's `is`.

You can do fun, highly specific, filters:

``` javascript
addTransitionState('attached', function(element) {
  // Fade in the main container after it's attached into the DOM.
  if (element.matches('body main.container')) {
    $(element).stop(true, true).fadeIn();
  }
});
```

If you like these transitions and want to declaratively assign them in tagged
templates, check out the [diffhtml-inline-transitions
plugin](https://github.com/tbranyen/diffhtml-inline-transitions).

**Available states**

Format is: `name[callbackArgs]`

- `attached[element]`
  For when an element is attached to the DOM.
- `detached[element]`
  For when an element leaves the DOM.
- `replaced[oldElement, newElement]`
  For when elements are swapped
- `attributeChanged[element, attributeName, oldValue, newValue]` 
  For when attributes are changed.
- `textChanged[element, oldValue, newValue]`
  For when text has changed in either TextNodes or SVG text elements.

### A note about detached/replaced element accuracy

When rendering Nodes that contain lists of identical elements, you may not
receive the elements you expect in the detached and replaced transition state
hooks. This is a known limitation of string diffing and allows for better
performance. By default if no key is specified, the last element will be
removed and the subsequent elements from the one that was removed will be
mutated via replace.

This isn't really ideal. **At all.**

What you should do here is add a `key` attribute with a unique `value` that
persists between renders.

For example, when the following markup...

``` html
<ul>
  <li>Test</li>
  <li>This</li>
  <li>Out</li>
</ul>
```

...is changed into...

``` html
<ul>
  <li>Test</li>
  <li>Out</li>
</ul>
```

The transformative operations are:

1. Remove the last element
2. Replace the text of the second element to 'out'

What we intended, however, was to simply remove the second item. And to achieve
that, decorate your markup like so...

``` html
<ul>
  <li key="1">Test</li>
  <li key="2">This</li>
  <li key="3">Out</li>
</ul>
```

...and update with matching attributes...

``` html
<ul>
  <li key="1">Test</li>
  <li key="3">Out</li>
</ul>
```

Now the transformative operations are:

1. Remove the second element

### Remove a transition state callback

Removes a global transition listener.

When invoked with no arguments, this method will remove all transition
callbacks.  When invoked with the name argument it will remove all transition
state callbacks matching the name, and so on for the callback.

``` javascript
// Removes all registered transition states.
diff.removeTransitionState();

// Removes states by name.
diff.removeTransitionState('attached');

// Removes states by name and callback reference.
diff.removeTransitionState('attached', callbackReference);
```

### HTML

You can use the `diff.html` tagged template helper to build up dynamic trees in
a way that looks very similar to JSX.

For instance the following example:

``` javascript
const fixture = document.createElement('div');

function showUnixTime() {
  fixture.querySelector('span').innerHTML = Date.now();
}

diff.outerHTML(fixture, `
  <div>
    <button>Show current unix time</button>
    <span>${Date.now()}</span>
  </div>
`);

fixture.addEventListener('click', showUnixTime);
```

Could be rewritten with the helper as:

``` javascript
const fixture = document.createElement('div');

function showUnixTime() {
  fixture.querySelector('span').innerHTML = Date.now();
}

diff.outerHTML(fixture, html`
  <div onclick=${showUnixTime}>
    <button>Show current unix time</button>
    <span>${Date.now()}</span>
  </div>
`);
```

So this feature allows for inline binding of any DOM event, and sending dynamic
property data to any element.

Tagged templates also have no problem consuming other tagged templates (even
from arrays), so you will be able to do:

``` javascript
const fixture = document.createElement('div');

const listItems = ['diff', 'HTML', '♥'];

diff.outerHtml(fixture, html`
  <ul>
    ${listItems.map(item => html`<li>${item.text}</li>`)}
  </ul>
`);
```

