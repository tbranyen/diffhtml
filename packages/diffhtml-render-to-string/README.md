# <±/> diffHTML Render to String

Stable Version: 1.0.0-beta.12

Use with diffHTML to render your Virtual Trees to strings. This is useful for
server-side rendering and testing. This works very similar to `outerHTML` and
will even accept all the same markup inputs as that API.

All middleware should work if it can run under Node.js. For instnace you can
use React-like Components by importing from diffhtml-components.

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
res.send(markup);
```

##### Example components

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
