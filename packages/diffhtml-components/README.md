# <±/> diffHTML Components

*Provides a way to use function, class, and stateful components with diffHTML.
Inspired by React and other component based frameworks.*

Stable Version: 1.0.0-beta.18

The exported classes `Component` and `WebComponent` are designed to be
inter-changeable and as close to feature-parity as possible. This helps bridge
the React / Web Component gap.

Refer to the website [https://diffhtml.org/components.html](https://diffhtml.org/components.html) for documentation.

## Installation

``` sh
npm install --save diffhtml-components
```

## Getting started

Before you can use this module, you will need to have diffHTML loaded first.
This component simply provides the `Component` and `WebComponent` classes, and
respective middleware, which help you create Virtual Trees to structure your
code.

You can create components as easy as:

``` js
import { html, innerHTML } from 'diffhtml';
import { Component, WebComponent } from 'diffhtml-components';

class MyComponent extends Component {
  render() {
    return html`
      <h1>Rendering a Web Component inside a React-Like Component:</h1>
      <web-component />
    `;
    //return (
    //  <span>Even Supports JSX (use Babel transform)!</span>
    //);
  }
}

// Only works if your browser supports the `customElements` global registry.
// Load a suitable polyfill if you really want to use these in production.
customElements.define('web-component', class extends WebComponent {
  render() {
    return html`
      <span>Custom Elements work just fine and 1:1 with React Components</span>
    `;
    //return (
    //  <span>Even Supports JSX (use Babel transform)!</span>
    //);
  }
});

innerHTML(document.body, html`<${MyComponent} />`);
```

## PropTypes

This static definition on either a function or class component provides a
specification for incoming props. It borrows from the React concept. While
these are common for runtime validation, they are also used to denote which
Web Component properties should be observed.

You simply provide a top level definition for the incoming prop. Use native
JavaScript constructor types.

Such as:

```js
import { html, innerHTML } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

class MyComponent extends WebComponent {
  render() {
    const { message } = this.props;
    return html`${message}`;
  }

  static propTypes = {
    message: String,
  }
}

customElements.define('my-component', MyComponent);

innerHTML(document.body, html`
  <my-component message="Valid" />
  <my-component message=${5} /> <!-- invalid -->
`);
```

## State

diffHTML Components are stateful and follow the React model of `setState`. By
default your components are given an empty `state` object that you can use to
store any kind of local state for your component. While you can edit this
object directly, this will not trigger any kind of component update. To set
the new state and trigger a re-render, you will need to use the `setState`
method.

For example:

``` js
import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

class SimpleCounter extends Component {
  render() {
    const { className, label  } = this.props;

    return html`
      <div class=${className}>${label}</div>
    `;
  }

  componentDidMount() {
    // Increment the `tick` state every second.
    this.interval = setInterval(() => this.setState({
      tick: ++this.state.tick,
    }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
}
```

The `setState` call receives the incoming object, which is merged into the
existing `this.state` and then into a brand new object, which effectively
causes your `state` property to be "immutable".

If you were to call `setState` in a tight loop, you would notice that the first
call would trigger a re-render, but would not render again until the tight
loop completes. This is a way to throttle while also allowing `setState` to be
reliable for synchronous operations.

If you do not like the behavior and wish to have more control over setting
state and rendering changes, look into `forceUpdate` below.

## Force Update

The `forceUpdate()` method is implemented and will trigger a no-questions-asked
-render of your component. This is a synchronous operation, but if diffHTML
has a paused transaction, this will wait until the existing transaction has
completed before modifying your component.

This is especially useful if you want to manage state outside of `setState` and
want your components to be reactive.

## Examples

The following examples show what real-world usage of these components may look
like.

### React Like

Useful when you need minimal React features for new projects. This is not
necessarily a good package for React Compatibility inter-op, although it can
work to load some components. If you need full parity with React, look to the
[`diffhtml-react-compat`](../packages/diffhtml-react-compat).

``` js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

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
  now: Number,
};

// Render to the `<body />` element.
innerHTML(document.body, html`<${SimpleClock} />`);
```

### Web Components

Will only work in browsers that support v1 Web Components specification. At the
moment this will in most stable browsers, with the exception of Internet
Explorer, which is current in development.

[Consensus & Standardization](https://www.chromestatus.com/feature/4696261944934400)

- **Chrome** Stable
- **Firefox:** Stable
- **Safari** Stable
- **Edge:** [In Development](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/customelements/)

``` js
import { html, innerHTML } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

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
  now: Number,
};

// Register into the browser's element registry.
customElements.define('simple-clock', SimpleClock);

// Render to the `<body />` element.
innerHTML(document.body, html`<simple-clock />`);
```
