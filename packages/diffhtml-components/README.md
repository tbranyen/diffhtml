diffHTML Components
-------------------

Stable Version: 1.0.0-beta

Stateful ES (JavaScript ES6) classes for rendering either Web Components or
React-Like (lightweight representation).

##### Installation

``` sh
npm install diffhtml-components
```

##### Examples

**React Like**

Useful when you need minimal React features for new projects. This is not a
good package for React Compatibility inter-op. Although it can work to load
some components.

``` js
import { html, innerHTML } from 'diffhtml';
import { Component, PropTypes } from 'diffhtml-components';

class SimpleClock extends Component {
  render() {
    const { now } = this.state;

    return html`
      <strong>The current unix timestamp is:</strong> ${now}
    `;
  }

  constructor(props) {
    super(props);

    this.state = { now: Date.now() };

    // Update very fast.
    setInterval(() => this.setState({ now: Date.now() }), 10);
  }
}

// Not-required, but nice to have for debugging purposes.
SimpleClock.propTypes = {
  now: PropTypes.number,
};

// Render to the `<body />` element.
innerHTML(document.body, html`<${SimpleClock} />`);
```


**Web Components**

Will only work in browsers that support v1 Web Components spec:

``` js
import { html, innerHTML } from 'diffhtml';
import { WebComponent, PropTypes } from 'diffhtml-components';

class SimpleClock extends WebComponent {
  render() {
    const { now } = this.state;

    return html`
      <strong>The current unix timestamp is:</strong> ${now}
    `;
  }

  constructor(props) {
    super(props);

    this.state = { now: Date.now() };

    // Update very fast.
    setInterval(() => this.setState({ now: Date.now() }), 10);
  }
}

// Required to auto-fill the `observedAttributes` function.
SimpleClock.propTypes = {
  now: PropTypes.number,
};

// Register into the browser's element registry.
customElements.define('simple-clock', SimpleClock);

// Render to the `<body />` element.
innerHTML(document.body, html`<simple-clock />`);
```
