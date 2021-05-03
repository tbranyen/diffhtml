# <±/> diffHTML Components

*Provides a way to use function, class, and stateful components with diffHTML.
Inspired by React and other component based frameworks.*

Stable Version: 1.0.0-beta.19

The exported class `Component` is designed to be used as either a vanilla JS
class component, or registered as a Web Component.

Refer to the website [https://diffhtml.org/components.html](https://diffhtml.org/components.html) for documentation.

## Installation

``` sh
npm install --save diffhtml-components
```

## Getting started

Before you can use this module, you will need to have diffHTML loaded first.
This component simply provides the `Component` class, and respective
middleware, which help you create Virtual Trees to structure your code.

You can create components as easy as:

``` js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

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

// Render as a class.
innerHTML(document.body, html`<${MyComponent} />`);

// If you are in a DOM environment that supports Web Components, then you can
// register your component and it will automatically work.
customElements.define('my-component', MyComponent);

// Now you can render like any other kind of HTML.
innerHTML(document.body, '<my-component />');
```

## Default props

This static definition on either a function or class component provides a
specification for incoming props. It borrows from the React concept. These are
very important for Web Components as they set up the observable properties. That
means you can simply update a property directly on the DOM Node and it will
automatically re-render.

Example of default props with a class component:

```js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

class MyComponent extends Component {
  render() {
    const { message } = this.props;
    return html`${message}`;
  }

  static defaultProps = {
    message: 'default',
  }
}

innerHTML(document.body, html`
  <${MyComponent} message="setting props via class" />
`);

// Defining your component as a web component is completely optional, but can be
// an interesting way to
customElements.define('my-component', MyComponent);

innerHTML(document.body, html`
  <my-component message="setting props via web component" />
`);

document.body.firstElementChild.message = 'Dynamic!';
// my-component has now automatically re-rendered to display this new state
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

### Function components

### Class components

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

// Render to the `<body />` element.
innerHTML(document.body, html`<${SimpleClock} />`);
```

### Web Components

All diffHTML Components extend HTMLElement and can be registered with the V1
Custom Elements registry. This is entirely optional.

[Full browser availability](https://caniuse.com/custom-elementsv1)

- **Chrome:** Stable
- **Firefox:** Stable
- **Safari:** Stable
- **Edge:** Stable

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

// Required to auto-fill the `observedAttributes` function.
SimpleClock.defaultProps = {
  now: Date.now(),
};

// Register into the browser's element registry.
customElements.define('simple-clock', SimpleClock);

// Render to the `<body />` element.
innerHTML(document.body, html`<simple-clock />`);
```
