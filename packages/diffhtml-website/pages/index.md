**Welcome to diffHTML!** An opinionated UI framework designed to create
reactive user interfaces. You can start using it quickly without much upfront
knowledge, and opt-into more powerful features as you go.

<a name="hello-world"></a>

---

## <a href="#hello-world">Hello world!</a>

With diffHTML, you are able to start building a reactive UI quickly, without
needing lots of upfront knowledge. You are able to start gracefully and improve
the integration as your requirements change, and harness more features.

```javascript
import { innerHTML } from 'https://diffhtml.org/es';

innerHTML(document.body, `
  <div>Hello world!</div>
`);
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-helloworld?path=hello-world.js&previewSize=100&attributionHidden=true"
    title="diffhtml-helloworld on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

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

There are two builds of diffHTML. The first and most common is the primary
build which contains a lightweight HTML parser. It is slightly larger than the
second build, which is referred to as the runtime build. This second build is
meant for pairing with output that has been optimized with the Babel plugin.

If you are just getting started, ignore the runtime build for now.

<a name="node-module"></a>

### <a href="#node-module">npm/yarn</a>

Use a JavaScript package manager to install locally.

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

Now tools using the Node module resolution algorithm, like Node and webpack,
can find diffHTML when it is attempted to be required.

```javascript
const { innerHTML } = require('diffhtml');
```

To load the runtime build use:

```javascript
const { innerHTML } = require('diffhtml/dist/cjs/runtime');
```

<a name="using-script-tag"></a>

### <a href="#using-script-tag">Script tag</a>

Use this tag in HTML to load diffHTML globally.

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>

<script>
  diff.outerHTML(document.body, `<body>Hello world!</body>`);
</script>
```

To load just the runtime:

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>
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

To load just the runtime:

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml/runtime?module';
// or
import { innerHTML } from 'https://diffhtml.org/es/runtime';
```

### <a name="using-import-maps" href="#using-import-maps">Using import maps</a>

[Import maps](https://github.com/WICG/import-maps) are a new new feature only
available in modern Chrome which allow you to specify a configuration to import
global names instead of using URLs or file paths directly.

For instance, you can convert:

```js
import { innerHTML } from 'https://diffhtml.org/es';
```

Into:

```js
import { innerHTML } from 'diffhtml';
```

Which will resolve to the same URL.

This is accomplished by adding a script tag to your web application that
specifies the configuration as JSON. And looks something like this:

```html
<script type="importmap">
{
  "imports": {
    "diffhtml": "https://diffhtml.org/es",
    "diffhtml/components": "https://diffhtml.org/master/diffhtml-components/dist/es"
  }
}
</script>
```

Remember this is JSON so you cannot have trailing commas or use single quotes.
It is also currently limited to being inline with the markup, it cannot be an
external file.

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
