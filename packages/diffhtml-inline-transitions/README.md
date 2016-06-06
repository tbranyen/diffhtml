diffHTML Inline Transitions
---------------------------

Tiny module to support binding/unbinding transition hooks declaratively.

#### Install

``` sh
npm install diffhtml-inline-transitions
```

#### Example

``` javascript
import * as diff from 'diffhtml';
import inlineTransitions from 'diffhtml-inline-transitions';

const { innerHTML, html } = diff;

// Sets up a global attribute handler that will monitor for hooks and
// auto-assign/remove them. If you don't want to globally import diffhtml, you
// pass an object with just addTransitionState and removeTransitionState.
inlineTransitions(diff);

// Logs out whenever the element or a child triggers the hook.
function attachedHook(parent, child) {
  console.log('Parent attached', parent === child ? 'itself' : child);
}

function render() {
  return html`<div attached=${attachedhook}>
    <div>I'm new!</div>
  </div>`;
}

innerHTML(document.body, render());
```

#### License

Copyright © 2016 Tim Branyen (@tbranyen)
Licensed under the MIT license.
