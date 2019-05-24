# Middleware

This concept allows developers to write plugins that augments diffHTML to do
different things. You can use pre-made middleware or create your own easily.

<a name="inline-transitions"></a>

---

## <a href="#inline-transitions">Inline Transitions</a>

[https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-inline-transitions](https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-inline-transitions)

Tiny module to support binding/unbinding declarative diffHTML transition hooks.

``` sh
npm install diffhtml-middleware-inline-transitions
```

Full events and args list:

| Event Name           | Args
| :------------------- | :----------------------------------------------------------
| **onattached**         | `(eventTarget, domNode)`
| **ondetached**         | `(eventTarget, domNode)`
| **onreplaced**         | `(eventTarget, oldNode, newNode)`
| **onattributechanged** | `(eventTarget, oldNode, attributeName, oldValue, newValue)`
| **ontextchanged**      | `(eventTarget, oldNode, oldValue, newValue)`

### Example

Apply to an element by passing the function to the associated state name:

``` js
import $ from 'jquery';
import { innerHTML, html, use } from 'diffhtml';
import inlineTransitions from 'diffhtml-middleware-inline-transitions';

// Enable the monitoring of attributes for changes.
use(inlineTransitions());

// Use jQuery to return a promise and fade in the body and paragraph.
function fadeIn(body, domNode) {
  return $(domNode).fadeOut(0).fadeIn(1000).promise();
}

innerHTML(document.body, html`<body onattached=${fadeIn}>
  <p>Watch me fade in slowly!</p>
</body>`);
```

<a name="logger"></a>

---

## <a href="#logger">Logger</a>

[https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-logger](https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-logger)

Use with diffHTML to `console.log` out render
[Transaction](https://diffhtml.org/#transaction) operations. This will nest
sub-component renders if they happen during a parent render.

``` sh
npm install diffhtml-middleware-logger
```

<img src="https://cloud.githubusercontent.com/assets/181635/23392088/32cacd8a-fd2e-11e6-9b95-e3124d827eea.png" width="100%">


### Example

``` javascript
import { use } from 'diffhtml';
import logger from 'diffhtml-middleware-logger';

use(logger());
```

This is not a very performant middleware, so please do not use this in
production where performance is critical. Use only in development or behind a
flag.

<a name="service-worker"></a>

---

## <a href="#service-worker">Service Worker</a>

[https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-service-worker](https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-service-worker)

While this does not really benefit from being a middleware, I made it as such
since it looks nice in the use and can be disabled if the middleware is
unsubscribed. I've added some developer niceties, like auto clearing the caches
for development. It's also possible to disable the worker completely if you get
annoyed with some behavior.

``` sh
npm install diffhtml-middleware-service-worker
```

### Example

``` javascript
import { use } from 'diffhtml';
import serviceWorker from 'diffhtml-middleware-service-worker';

// Defaults shown, these are all optional values.
use(serviceWorker({
  url: '/service-worker.js',
  scope: '/',
  autoClearCaches: location.search.includes('diff_autoclear'),
  disable: location.search.includes('diff_disable'),
  quiet: location.search.includes('diff_quiet'),
  options: {},
}));
```


<a name="synthetic-events"></a>

---

## <a href="#synthetic-events">Synthetic Events</a>

[https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-synthetic-events](https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-synthetic-events)

Changes the event binding from inline event handlers like `onclick = fn` to use
`addEventListener`. Hooks are attached to the `body` element and coordinated
using event delegation.

``` sh
npm install diffhtml-middleware-synthetic-events
```

### Example

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

<a name="verify-state"></a>

---

## <a href="#verify-state">Verify State</a>

[https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-verify-state](https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-verify-state)

Asserts that a render properly updated the old Virtual Tree and the DOM. Will
recursively search for inconsistencies, displays warnings unless debugging is
enabled, then it throws errors instead.


``` sh
npm install diffhtml-middleware-verify-state
```

<img src="https://cloud.githubusercontent.com/assets/181635/23392650/1d7dfdcc-fd32-11e6-8f41-b412279cea55.png" width="100%">

### Example

``` js
import { use } from 'diffhtml';
import verifyState from 'diffhtml-middleware-verify-state';

// Throw when debug is truthy (when location.search has `?debug`)
use(verifyState({ debug: location.search.includes('debug') }));
```

---
