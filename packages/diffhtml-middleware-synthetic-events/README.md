diffHTML Middleware Synthetic Events
------------------------------------

Stable Version: 1.0.0-beta

Changes the event binding from inline event handlers like `onclick = fn` to use
`addEventListener`. Hooks are attached to the `body` element and coordinates
events using delegation.

##### Installation

``` sh
npm install diffhtml-middleware-synthetic-events
```

##### Example

``` javascript
import { use } from 'diffhtml';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';

use(syntheticEvents());
```

A good use case for this middleware is building a Chrome Extension where using
inline event handlers is not possible. Supports non-bubbling events via the
`useCapture` flag.
