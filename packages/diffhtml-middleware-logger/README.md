# <±/> diffHTML Logger Middleware

Stable Version: 1.0.0-beta.16

Use with diffHTML to `console.log` out [render
transaction](https://diffhtml.org/#transaction) operations. This will nest
sub-component renders if they happen during a parent render.

![middleware](https://cloud.githubusercontent.com/assets/181635/23392088/32cacd8a-fd2e-11e6-9b95-e3124d827eea.png)

##### Installation

``` sh
npm install diffhtml-middleware-logger
```

##### Example

``` javascript
import { use } from 'diffhtml';
import logger from 'diffhtml-middleware-logger';

use(logger());
```

This is not a very performant middleware, so please do not use this in
production where performance is critical. Use in development.
