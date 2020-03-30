# <±/> diffHTML Verify State Middleware

Stable Version: 1.0.0-beta.13

Asserts that a render properly updated the old Virtual Tree and the DOM. Will
recursively search for inconsistencies, displays warnings unless debugging is
enabled, then it throws errors instead.

![verify-state](https://cloud.githubusercontent.com/assets/181635/23392650/1d7dfdcc-fd32-11e6-8f41-b412279cea55.png)

##### Installation

``` sh
npm install diffhtml-middleware-verify-state
```

##### Example

``` javascript
import { use } from 'diffhtml';
import verifyState from 'diffhtml-middleware-verify-state';

// Throw when debug is truthy (when location.search has `?debug`)
use(verifyState({ debug: location.search.includes('debug') }));
```

This is not a very performant middleware, so please do not use this in
production where performance is critical. Use in development.
