**Welcome to diffHTML,** a lightweight library for creating fast and reactive
user interfaces using JavaScript and HTML. With this tool you can create
applications, games, data visualizations, and much more! It is designed to be
approachable to new programmers, intermediates, and professionals.

<a name="core-features"></a>

---

## <a href="#core-features">Core features</a>

- No build step required to prototype
- ESM/CJS/UMD + Minified ES5 builds
- Middleware
- Efficient Virtual DOM
- Object pooling and custom HTML parser to optimize GC
- Strict mode TypeScript via checkJS

<a name="getting-started"></a>

---

## <a href="#getting-started">Getting started</a>

Depending on your project, preference, or both, you'll need to include diffHTML
somehow in your code. Examples of linking using three different popular methods
are available below.

<a name="node-module"></a>

### <a href="#node-module"><u>Package manager</u></a>

This method uses a CLI tool such as npm or yarn to download and install the
package files directly in your Node-based project. This is useful for server-
side applications and tools like webpack, browserify, and rollup.

<div id="install"></div>

* <svg viewBox="0 0 18 7" width="40" height="15" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  ``` sh
  npm install --save diffhtml
  ```

* <img width="60" height="27" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

<a name="using-script-tag"></a>

### <a href="#using-script-tag"><u>Script tag</u></a>

A script tag is useful for snippets, small projects, and possibly larger
projects that want to have runtime control over the asset. You simply point a
script tag to one of the files:

- https://unpkg.com/diffhtml/dist/diffhtml.js - _full debug build_
- https://unpkg.com/diffhtml/dist/diffhtml-lite.js - _lite debug build_
- https://unpkg.com/diffhtml/dist/diffhtml.min.js - _compressed full build_
- https://unpkg.com/diffhtml/dist/diffhtml-lite.min.js - _compressed lite build_

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>

<!-- To explore the API -->
<script>console.log(window.diff);</script>
```

<a name="es-modules"></a>

### <a href="#es-modules"><u>ES modules</u></a>

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml?module';
// or
import { innerHTML } from 'https://diffhtml.org/es';
```

<a name="examples"></a>

---

## <a href="#examples">Examples</a>

The following examples are presented using [Glitch](https://glitch.com). Click
the _View Source_ button under each example to view the source code. Each project
has a different set of requirements and complexity level. Click _Remix To Edit_
to fork the example and mess with the code.

<a name="hello-world"></a>

### <a href="#hello-world"><u>Hello World</u></a>

A simple application that renders 'Hello world!' in a <code>&lt;div&gt;</code>
from string markup input. Demonstrates how quickly one can start prototyping.
Loads latest diffHTML core from this website using native JavaScript modules.

<div class="glitch-embed-wrap" style="height: 200px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-helloworld?path=hello-world.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-helloworld on Glitch"
    style="height: 100%; width: 100%; border: 0;"
    loading="lazy">
  </iframe>
</div>

<a name="clock"></a>

---

### <a href="#clock"><u>Clock</u></a>

A medium complexity application that displays a realtime clock using SVG and
<code>requestAnimationFrame</code>. Loads latest diffHTML core from this website
using native JavaScript modules.

<div class="glitch-embed-wrap glitch-clock" style="height: 300px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-clock?path=script.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-clock on Glitch"
    style="height: 100%; width: 100%; border: 0;"
    loading="lazy">
  </iframe>
</div>

<a name="hacker-news"></a>

---

### <a href="#hacker-news"><u>Hacker News</u></a>

A more complex application that displays Hacker News. Allows reading latest
posts and comments. Installable as a PWA. Click the fullscreen icon next to
_View Source_ to get the install prompt. Loads latest diffHTML core and plugins
from this website using native JavaScript modules.

<div class="glitch-embed-wrap glitch-clock" style="height: 300px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-hackernews?path=script.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-hackernews on Glitch"
    style="height: 100%; width: 100%; border: 0;"
    loading="lazy">
  </iframe>
</div>

<a name="todomvc"></a>

---

### <a href="#todomvc"><u>TodoMVC</u></a>

This application can serve as a reference for those looking into a more advanced
build setup. Rollup bundles the source and executes [babel-transform](/tools.html#babel-transform)
which transforms all UI markup into JavaScript at build time. Replaces the core build
with the lite version to reduce build size. [Zopfli](https://github.com/google/zopfli) is used to pre-gzip the markup
bringing the production output size to ~14kb. Loads diffHTML and plugins from
npm pinned to <code>1.0.0-beta.20</code>. It may be periodically updated.

<div class="glitch-embed-wrap" style="height: 400px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-todomvc?path=lib/index.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-todomvc on Glitch"
    style="height: 100%; width: 100%; border: 0;"
    loading="lazy">
  </iframe>
</div>

---
