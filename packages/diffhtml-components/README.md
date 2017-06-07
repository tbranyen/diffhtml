# <div style="background-color: #FFF; display: inline-block; padding: 10px 0px; color: #333;"><±/> diffHTML Components</div>

*JavaScript classes for rendering components using either Custom Element or
React-inspired implementations.*

Stable Version: 1.0.0-beta.2

The component classes `Component` and `WebComponent` are designed to be
interchangeable and as close to feature-parity as possible. This helps bridges
the React and Web Component gap.

## Installation

``` sh
npm install diffhtml-components
```

## Getting started

Before you can use this module, you will need to have diffHTML loaded first.
This component simply provides the `Component` and `WebComponent` classes that
help you create Virtual Trees and structure your code.

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

innerHTML(document.body, html`<${App} />`);
```

## PropTypes

The PropTypes package has been extracted out of React into a standalone module
(`npm i prop-types`) which can be used with both `Component` and `WebComponent`
implementations.

**If you are using Web Components please note that PropTypes are required so
that the implementation knows which attributes to fire change events on.**

[See the MDN article on it for more
information](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Observed_attributes)

## State

State 

## Force Update

The `forceUpdate()` method is implemented and will trigger a no-questions-asked
re-render of your component. This is a synchronous operation, but if diffHTML
has a paused transaction, 

## Examples

*React Like*

Useful when you need minimal React features for new projects. This is not a
good package for React Compatibility inter-op. Although it can work to load
some components.

``` js
import { html, innerHTML } from 'diffhtml';
import Component from 'diffhtml-components/lib/component';
import PropTypes from 'prop-types';

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


*Web Components*

Will only work in browsers that support v1 Web Components spec:

``` js
import { html, innerHTML } from 'diffhtml';
import WebComponent from 'diffhtml-components/lib/web-component';
import PropTypes from 'prop-types';

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
