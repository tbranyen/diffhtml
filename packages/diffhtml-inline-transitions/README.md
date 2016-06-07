diffHTML Inline Transitions
---------------------------

[![Build Status](https://travis-ci.org/tbranyen/diffhtml-inline-transitions.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml-inline-transitions)
[![Coverage Status](https://coveralls.io/repos/github/tbranyen/diffhtml-inline-transitions/badge.svg?branch=master)](https://coveralls.io/github/tbranyen/diffhtml-inline-transitions?branch=master)

Tiny module to support binding/unbinding transition hooks declaratively.

#### Install

``` sh
npm install diffhtml-inline-transitions
```

#### Transition hooks

diffHTML allows developers to globally define transitions that can react to
changes in the DOM and optionally prevent renders until a returned Promise
completes. This is ideal for animations and monitoring when things happen.

What isn't ideal is defining all these transitions globally. It'd be nicer to
be able to inline them directly into a tagged template...

This module does just that, and works identical to `addTransitionState`, except
for one minor difference. It adds the element you defined the transition on as
the first argument to the transition callback.

For instance with diffHTML, the attached callback would be called with the
element being added. With this helper, the element you defined the transition
on would be the first argument, and the second argument would be any element
that is a descendant or in some cases the same element.

More docs on transitions here:
https://github.com/tbranyen/diffhtml#user-content-add-a-transition-state-callback

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
