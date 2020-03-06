# <±/> diffHTML React Compat 

Stable Version: 1.0.0-beta.11

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
