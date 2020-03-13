# <±/> diffHTML ServiceWorker Middleware

Stable Version: 1.0.0-beta.12

while this does not really benefit from being a middleware, i made it as such
since it looks nice when added to `use()` and can be disabled if the middleware
is unsubscribed. i've added some developer niceties, like auto clearing the
caches for development. it's also possible to disable the worker completely if
you get annoyed with some behavior.

## Installation

``` sh
npm install diffhtml-middleware-service-worker
```

## Example

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

## Options

These options are available to change depending on the use case. It is
entirely possible to get away with simply:

``` javascript
use(serviceWorker());
```

If you meet the the default use case.

### `url`

Specifies which Service Worker URL to load.

### `scope`

Specifices the path to use, called scope since it restricts what content is
visible.

### `autoClearCaches`

Allow the middleware to automatically clear all caches. By default this is
disabled as it defeats the point of a service worker and may muck with other
apps running on localhost. Can be toggled via the query param
`?diff_autoclear`.

### `disable`

Unregisters all Service Workers and does not try to register a new one. This
can be toggled via the query param: `?diff_disable`.

### `quiet`

Do not log anything to the console. Can be toggled via the query param
`?diffhtml_quiet`.

### `options`

Defaults to an empty object, gets spread into the Service Worker registration
call.
