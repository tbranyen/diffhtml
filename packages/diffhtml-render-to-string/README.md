# <±/> diffHTML Render to String

Stable Version: 1.0.0-beta.7

Use with diffHTML to render your Virtual Trees to strings. This is useful for
server-side rendering and testing.

##### Installation

``` sh
npm install diffhtml-render-to-string
```

##### Example

``` javascript
import { html } from 'diffhtml';
import renderToString from 'diffhtml-render-to-string';

const markup = renderToString(html`
  <div>Hello world</div>
`);

// Use with something like express to send to the client.
res.send(markup);
```

This will automatically invoke and render React-like Components. Web Components
cannot be hydrated since they are rendered into the Shadow DOM.
