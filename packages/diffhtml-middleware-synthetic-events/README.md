# <±/> diffHTML Synthetic Events Middleware

Stable Version: 1.0.0-beta.26

Changes the event binding from inline event handlers like `onclick = fn` to use
`addEventListener`. Hooks are attached to the `body` element and coordinated
using event delegation.

## Installation

``` sh
npm install diffhtml-middleware-synthetic-events
```

## Example

``` js
import { use, html, innerHTML } from 'diffhtml';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';

use(syntheticEvents());

function render() {
  return html`
    <div onclick=${e => console.log(e)} />
  `;
}

// Binds the event on div using `addEventListener`.
innerHTML(document.body, render());
```

A good use case for this middleware is building a Chrome Extension where using
inline event handlers is not possible. Supports non-bubbling events via the
`useCapture` flag.
