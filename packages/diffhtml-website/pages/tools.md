# Additional packages

<a name="babel-transform"></a>

---

## <a href="#babel-transform">Babel Transform (Optimize builds)</a>

The Babel plugin is useful after you have a working project and wish to
optimize it at build time. The Babel plugin will perform numerous optimizations
to your code depending on how it is written and structured. For instance,
anytime you have an element that does not change, the call will be hoisted and
reused instead of recreated every time. Any `html` tagged template calls will
be converted to `createTree` calls.

**After your code has been passed through this plugin, you will be able to fully
utilize the lite build!**

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
every time `render()` is called. If you use the lite build and the parser,
this will become a cached call. `html` is the same thing as `createTree` in the
lite build. So there is no HTML parsing happening.

```javascript
const { innerHTML, html } = require('diffhtml/dist/cjs/lite');

function render() {
  innerHTML(document.body, html('div', {}, [html('#text', null, 'Hello world')]));
}
```

[Refer to the configuration documentation.](https://github.com/tbranyen/diffhtml/tree/master/packages/babel-plugin-transform-diffhtml#-diffhtml-babel-transform-plugin)

<a name="render-to-string"></a>

---

## <a href="#render-to-string">Render to String</a>

While Virtual DOM libraries are designed to work in the browser and keep UI
presentation state synchronized, they are also very beneficial in a Node
runtime environment.

This package will crawl your reconciled tree (after all middleware are applied)
and serialize to a string. Since middleware is supported, you can use this
module to hook into Nodes and change the output. This can be especially useful
when you need to do XML-like transformations.

The primary use case of this module is for server-side rendering of web
applications. You can easily render the specific state as flat markup and then
re-hydrate on the client side.

A super simple example of rendering a Virtual Tree:

```javascript
import { renderToString, html } from 'diffhtml-render-to-string';

renderToString(html`
  <div>Hello world</div>
`);

// <div>Hello world</div>
```

Since middleware is supported, you can simply include the diffhtml-components
package to get full component rendering support.

```javascript
import { renderToString, html } from 'diffhtml-render-to-string';
import 'diffhtml-components';

function Component() {
  return '<div>Hello world</div>';
}

renderToString(html`
  <${Component} />
`);

// '<div>Hello world</div>'
```


<a name="live-reload-server"></a>

---


## <a href="#live-reload-server">Live Reload Server</a>

This server is designed for the diffhtml-website. Whenever the markdown files
change, it compiles them to HTML and re-renders the relevant HTML live. Other
assets may trigger a full page reload.
