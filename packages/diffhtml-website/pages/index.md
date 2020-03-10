**Welcome to diffHTML!** A library that assists with creating user interfaces
using JavaScript. These interfaces can be: applications, games, data
visualizations, or anything else that you may want to render in a web browser.


<a name="hello-world"></a>

---

## <a href="#hello-world">Hello world!</a>

```javascript
import { innerHTML } from 'https://diffhtml.org/es';

innerHTML(document.body, `
  <div>Hello world!</div>
`);
```

<a name="core-features"></a>

---

## <a href="#core-features">Core features</a>

- <span class="list-icon fa fa-exchange"></span> ESM/CJS/UMD builds
- <span class="list-icon fa fa-retweet"></span> Async transition hooks
- <span class="list-icon fa fa-link"></span> Middleware
- <span class="list-icon fa fa-code"></span> Efficient Virtual DOM
- <span class="list-icon fa fa-tree"></span> Virtual tree object pooling
- <span class="list-icon fa fa-codiepie"></span> Automatic memory management

<a name="getting-the-source"></a>

---

## <a href="#getting-the-source">Getting the source</a>

<a name="node-module"></a>

### <a href="#node-module">Package manager</a>

<div id="install"></div>

* <svg viewBox="0 0 18 7" width="40" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  ``` sh
  npm install --save diffhtml
  ```

* <img width="60" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

<a name="using-script-tag"></a>

### <a href="#using-script-tag">Script tag</a>

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>
<script>console.log(window.diff);</script>
```

<a name="es-modules"></a>

### <a href="#es-modules">ES modules</a>

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml?module';
// or
import { innerHTML } from 'https://diffhtml.org/es';
```

<a name="optimizing-builds"></a>

---

## <a href="#optimizing-builds">Optimizing builds</a>

The Babel plugin is useful after you have a working project and wish to
optimize it at build time. The Babel plugin will perform numerous optimizations
to your code depending on how it is written and structured. For instance,
anytime you have an element that does not change, the call will be hoisted and
reused instead of recreated every time. Any `html` tagged template calls will
be converted to `createTree` calls.

**After your code has been passed through this plugin, you will be able to fully
utilize the runtime build!**

To use, install into your project as a dev dependency.

``` sh
npm install -D babel-plugin-transform-diffhtml
```

Specify the plugin in the Babel configuration, usually a `.babelrc` or
`babel.config.js` file:

```json
{
  "plugins": ["babel-plugin-transform-diffhtml"]
}
```

Take this code as an example input:

```javascript
const { innerHTML, html } = require('diffhtml');

function render() {
  innerHTML(document.body, html`
    <div>Hello world</div>
  `);
}
```

Without this Babel transformation process, this HTML would need to be parsed
every time `render()` is called. If you use the runtime build and the parser,
this will become a cached call. `html` is the same thing as `createTree` in the
runtime build. So there is no HTML parsing happening.

```javascript
const { innerHTML, html } = require('diffhtml/dist/cjs/runtime');

function render() {
  innerHTML(document.body, html('div', {}, [html('#text', null, 'Hello world')]));
}
```

[Refer to the configuration documentation.](https://github.com/tbranyen/diffhtml/tree/master/packages/babel-plugin-transform-diffhtml#-diffhtml-babel-transform-plugin)

---
