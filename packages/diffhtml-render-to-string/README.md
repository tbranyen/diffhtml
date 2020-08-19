# <±/> diffHTML Render to String

Stable Version: 1.0.0-beta.18

Renders Virtual Tree (VDOM) markup to string. This is useful for server-side
rendering, static HTML exporting, creating diffs, and testing.

All middleware should work if it can run under Node.js. For instance you can
use Components by importing from diffhtml-components or get logging by
importing diffhtml-middleware-logger.

##### Installation

``` sh
npm install diffhtml-render-to-string
```

##### Example

``` javascript
import { html } from 'diffhtml';
import { renderToString } from 'diffhtml-render-to-string';

const markup = renderToString(html`
  <div>Hello world</div>
`);

// Use with something like express to send to the client.
//res.send(markup);
```

##### Passing options

``` javascript
import { html } from 'diffhtml';
import { renderToString } from 'diffhtml-render-to-string';

const markup = renderToString(html`
  <div>Hello world
`, { parser: { strict: true } });

// throws an error as markup is malformed
```

##### Using components

``` javascript
import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';
import { renderToString } from 'diffhtml-render-to-string';

class MyComponent extends Component {
  render({ message }) {
    return html`
      <p>${message}</p>
    `;
  }
}

const markup = renderToString(html`
  <${MyComponent} message="Hello world" />
`);

// Use with something like express to send to the client.
res.send(markup);
```
