# <±/> diffHTML React Compat 

Stable Version: 1.0.0-beta.22

This is a compatibility package meant to be a drop-in replacement for the
modules: `react` and `react-dom`. It wraps the [diffHTML
Components](../diffhtml-components) repository as the base for the `Component`
constructor. It then layers additional React-specific APIs.

## Installation

``` sh
npm install diffhtml diffhtml-react-compat
```

## Additional React APIs Included

- [Synthentic Events middleware](../diffhtml-middleware-synthetic-events), enabled by default [(React Docs)](https://facebook.github.io/react/docs/events.html)
- `React.createElement` - Creates a React-compatible Virtual Tree Element [(React Docs)](https://facebook.github.io/react/docs/react-api.html#createelement)
- `React.cloneElement` - Clones a Virtual Tree Element [(React Docs)](https://facebook.github.io/react/docs/react-api.html#cloneelement)
- `React.createFactory` - Creates a reusable function to produce Virtual Tree Elements [(React Docs)](https://facebook.github.io/react/docs/react-api.html#createfactory)
- `React.isValidElement` - Determines if the Element is a React Virtual Tree Element [(React Docs)](https://facebook.github.io/react/docs/react-api.html#isvalidelement)
- `React.Children` - Helpers for working with `props.children` [(React Docs)](https://facebook.github.io/react/docs/react-api.html#react.children)
- `ReactDOM.render` - Renders the top level component into the DOM [(React Docs)](https://facebook.github.io/react/blog/2015/10/01/react-render-and-top-level-api.html)

## PropTypes

The PropTypes package has been extracted out of React into a standalone module
(`npm i prop-types`) which can be used with both `Component` and `WebComponent`
implementations.

**If you are using Web Components please note that PropTypes are required so
that the implementation knows which attributes to fire change events on.**

[See the MDN article on it for more
information](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Observed_attributes)


Example using PropTypes with ES6:

``` js
import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';
import PropTypes from 'prop-types';

class MyComponent extends Component {
  render() {
    const { className } = this.props;

    return html`
      <div class=${className}>${label}</div>
    `;
  }
}

MyComponent.propTypes = {
  className: PropTypes.string.isRequired,
  label: PropTypes.string,
};
```

Using with `babel-plugin-transform-class-properties`:

``` js
import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';
import PropTypes from 'prop-types';

class MyComponent extends Component {
  render() {
    const { className } = this.props;

    return html`
      <div class=${className}>${label}</div>
    `;
  }

  static propTypes = {
    className: PropTypes.string.isRequired,
    label: PropTypes.string,
  }
}
```

Also note that in order to fully remove PropTypes from a bundler, you will need
to add additional configuration. Please consult the bundlers documentation for
this until we add examples.
