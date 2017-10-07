**Welcome to diffHTML!** An easy-to-use and powerful Virtual DOM library that
was written to be extensionable, powerful, and very fast. Use this to build
components, applications, games, and more.

## Core Features

- <span class="list-icon fa fa-check" /> ES Module support
- <span class="list-icon fa fa-check" /> Efficient Virtual DOM
- <span class="list-icon fa fa-check" /> Object pooling and memory management
- <span class="list-icon fa fa-check" /> Transitions
- <span class="list-icon fa fa-check" /> Middleware

## Installing & Importing

Depending on your use case you may have to install **diffHTML** from a registry
using a package manager or you can reference it directly from a server.
Depending on your use case you will use one or the other.

### Script tag

Using this method will bring in the global minified UMD file. This includes the
parser so it will be larger than the runtime build weighing at around
**7.5kb**. Access the API through the `window.diff` global.

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>

<script>
  const { innerHTML } = window.diff;
</script>
```

If you use the Babel transform, you will be able to use the runtime instead.
This converts `html` tagged template calls into `createTree` calls, which take
in the Babel converted trees. This greatly reduces the bundle sizes. The base
bundle size here is only **5.7kb** min+gzip!

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml-runtime.min.js"></script>
```

### Installing into `node_modules`

You have two options, the official npm client or the yarn alternative.

* <svg viewBox="0 0 18 7" width="40" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  The official package client that ships with Node, can install 

  ``` sh
  npm install --save diffhtml
  ```

* <img width="60" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

### ES modules

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

#### > diffhtml.org server

Hosted on my Linode, don't rely on this for complete stability, but it supports
**http/2** push so it's great for development. I'll always update this to
guarentee to be the latest version. Consider this "bleeding edge", if you need
stability use **unpkg** below.

``` javascript
// When you're loading from https, you can go protocol-less.
import { innerHTML } from '//diffhtml.org/es';

// When you're loading from file: or http:
import { innerHTML } from 'https://diffhtml.org/es';
```

#### > unpkg.com server

Sometimes outdated, cold start is sometimes slow, doesn't have **http/2**, but
is significantly more stable, so think of this as stable LTS.

``` javascript
import { innerHTML } from '//unpkg.com/diffhtml?module';
```

diffHTML is designed to be portable, so you can consume it in a number of ways
depending on your environment. You can load imports  works well with or without a build tool. It
can be laode dby browsers with the ES Module syntax.
 
There are many ways of getting diffHTML. It has been designed to be flexible
and the smallest filesize possible.

* **HTTP (Recommended for Beginners):**

  ```
  <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.js"></script>
  ```


_While `diffhtml` is the core package to install, there are many other modules you may also want to install depending on your use cases._


**turns:**

``` javascript
// Manually create container.
const div = document.createElement('div');

// Update the content using the `innerHTML` property.
div.innerHTML = 'Hello world';

// Add into the page body.
document.body.appendChild(div);

// Update only the text.
div.textContent = 'Hello updated world!';
```

**into:**

``` javascript
// Declaratively create a DIV with the content and append into the page body.
diff.innerHTML(document.body, '<div>Hello world</div>');

// Represent how you want the body to look and diffHTML will update only the
// changed text.
diff.innerHTML(document.body, '<div>Hello updated world!</div>');
```

* HTTP (Recommended for Beginners):

  ```
  <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.js"></script>
  ```

* <svg viewBox="0 0 18 7" width="40" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  ``` sh
  npm install diffhtml
  ```

* <img width="60" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

_While `diffhtml` is the core package to install, there are many other modules you may also want to install depending on your use cases._
