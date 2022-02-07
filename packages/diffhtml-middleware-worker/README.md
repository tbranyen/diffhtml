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
actual patching. The lite version is preferable since it's a smaller filesize.

```js
import { use } from 'https://diffhtml.org/core/lite';
import { mainTask, createWebWorker } from 'https://diffhtml.org/middleware-worker';

use(mainTask());

const mount = document.body;
createWebWorker('./path/to/worker.js', { mount });
```

The above code will create a worker that exists at `worker.js` and proxy all
rendering from it into the mount point, in this case the `<body>` tag.

A simple example of what the worker code could look like is below:

```js
import { use, html, createTree, innerHTML } from 'https://diffhtml.org/core';
import { workerTask } from 'https://diffhtml.org/middleware-worker';

use(workerTask());

// Create an empty fragment to render into, this represents the body tag
// in the main thread.
const placeholder = createTree();

innerHTML(placeholder, html`
  <h1>Hello world from a worker thread!</h1>
`);
```

### With Node.js



