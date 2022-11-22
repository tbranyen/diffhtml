# <±/> diffHTML Worker Middleware

Stable Version: 1.0.0-beta.23

Used to separate the diffing and patching stages of rendering across threads.
The main thread receives payloads containing mutations to apply, all UI logic
is isolated within a worker thread.

Can be used with Node.js servers and pass patches to the client using Web
Sockets.

## Installation

``` sh
npm install diffhtml-middleware-worker
```

## Usage

When you create a worker, you bind it to a mount point and all `innerHTML` or
`outerHTML` calls that get made in the worker are intercepted and passed to the
main thread.

### In a browser

To create a web worker in the browser, import the `createWebWorker` function.
Invoke this with a file path pointing to the location of your module that
contains the rendering logic. This file path will be explained more after the
following code snippet.

You must import either the core or lite version in the main thread to do the
actual patching. The lite version is preferable due to the smaller filesize.
Then register the middleware into the main thread.

```js
import { use } from 'https://diffhtml.org/core/lite';
import { mainTask, createWebWorker } from 'https://diffhtml.org/middleware-worker';

use(mainTask());
```

Once the middleware is registered, you can create web workers using the helper
function. If you already have a worker you can pass it instead of a string to
have the events hooked up.

```js
const mount = document.body;
createWebWorker('./path/to/worker.js', { mount });
```

The above code will create a worker that exists at `worker.js` and proxy all
rendering from it into the mount point, in this case the `<body>` tag. You
must register the `workerTask` middleware inside the worker to ensure patches
are properly passed to the main thread.

```js
import { use, html, createTree, innerHTML } from 'https://diffhtml.org/core';
import { workerTask } from 'https://diffhtml.org/middleware-worker';

use(workerTask());
```

In the worker you must create a placeholder to render into. This will
emulate the mount in the main thread.

```js
// Create an empty fragment to render into, this represents the body tag
// in the main thread.
const placeholder = createTree();

// Any outerHTML or innerHTML calls will be proxied to the main thread mount
// point.
innerHTML(placeholder, html`
  <h1>Hello world from a worker thread!</h1>
`);
```

### With Node.js


