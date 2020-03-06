# Additional packages

<a name="#render-to-string"></a>

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


<a name="#live-reload-server"></a>

---


## <a href="#live-reload-server">Live Reload Server</a>

This server is designed for the diffhtml-website. Whenever the markdown files
change, it compiles them to HTML and re-renders the relevant HTML live. Other
assets may trigger a full page reload.
