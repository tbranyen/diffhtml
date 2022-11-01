# Middleware

While you can get very far with just the basic rendering features of diffHTML,
you may find yourself wanting to extend or hook into the Transaction flow. A
good way of hooking into the lifecycle is to use middleware. These are objects
or functions that are provided by the top-level [`use()`](/api.html#use) API.

```js
import { use } from 'diffhtml';

// Use the logger middleware
use(logger());
```

<a name="writing-middleware"></a>

---

## <a href="#writing-middleware">Writing middleware</a>

Authoring middleware was designed to be straightforward for simple things like
tracking when renders occur, what the previous and next VTrees look like, and
what the given set of DOM updates were for the render.

While simple things are easy to access, the API allows for significantly more
complex operations, such as:

- Creating new elements
- Changing the DOM synchronization logic
- Adopt elements/components from other frameworks
- XML transformations
- React to DevTools changes

Lastly, middleware can be used with the [toString](https://diffhtml.org/api.html#to-string) method. So if you are extra ambitious you can get your
middleware to be fully cross-platform even during Server-Side-Rendering.

The code for a basic middleware looks as simple as:

``` js
import { use } from 'diffhtml';

use(transaction => {
  console.log('Render transaction is starting');

  return () => {
    console.log('Render transaction is ending');

    transaction.onceEnded(() => {
      console.log('Render transaction has completed');
    });
  };
});
```

There are several core middleware modules already written that you could use as
a reference. A good starting one to look at is the [Logger](/middleware#logger)
if you're interested in logging the render transaction flow.

``` js
use(() => ({ patches }) => {
  console.log(patches);
});
```

<a name="logger"></a>

---

## <a href="#logger">Logger</a> <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-logger"><i class="fa fa-github" /></a>

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

## <a href="#service-worker">Service Worker</a> <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-service-worker"><i class="fa fa-github" /></a>

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

## <a href="#synthetic-events">Synthetic Events</a> <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-synthetic-events"><i class="fa fa-github" /></a>

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

## <a href="#verify-state">Verify State</a> <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-verify-state"><i class="fa fa-github" /></a>

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

<a name="html-linter"></a>

---

## <a href="#html-linter">HTML Linter</a> <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-middleware-linter"><i class="fa fa-github" /></a>

Validates your passed in markup against rules established in the [HTMLHint](https://htmlhint.com/) project.

``` sh
npm install diffhtml-middleware-linter
```

### Example

``` js
import { use } from 'diffhtml';
import linter from 'diffhtml-middleware-linter';

use(linter({
  // Supported rules and their defaults.
  rules: {
    "tagname-lowercase": true,
    "attr-lowercase": true,
    "attr-value-not-empty": false,
    "id-unique": true,
    "src-not-empty": true,
    "title-require": true,
    "alt-require": true,
    "id-class-value": "dash",
    "style-disabled": false,
    "inline-style-disabled": false,
    "inline-script-disabled": false,
    "attr-unsafe-chars": true,
    "head-script-disabled": true,
  },

  renderErrors: true // by default is false
}));
```

---
