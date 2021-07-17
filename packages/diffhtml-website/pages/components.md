# Components <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-components"><i class="fa fa-github"></i></a>

Components are useful when you have parts of your interface that you wish to
reuse or structure. There many popular component frameworks, with React being
one of the most popular ones. diffHTML provides component features that mimic
what you'd find in React, but in many different ways that are very flexible.

<a name="overview"></a>

---

## <a href="#overview">Overview</a>

In order to use components, you must install/fetch the components package. This
contains middleware which will render functions, stateless classes, and
stateful classes. Unlike middleware, this package will automatically hook its
middleware into the running diffHTML build.

Using components in diffHTML always requires installing or including the base
package:

``` sh
npm install --save diffhtml-components
```

If you need to import React components, install the compat package:

``` sh
npm install --save diffhtml-react-compat
```

> This will allow you to point `react` and `react-dom` in your project to this
package and get the same functionality with diffHTML.

There are two primary packages for components: [diffhtml-components](#overview)
and [diffhtml-react-compat](#react-compat).Unlike other frameworks diffHTML is
extremely flexible with what you can return, and allows for seamless JSX
integration, top-level fragments, and supports stateless classes that do not
need to extend from a base class.

### Function component

```javascript
import { html, innerHTML } from 'diffhtml';

function MyComponent(props) {
  return html`
    <div>Some prop = ${props.someProp}</div>
  `;
}

innerHTML(document.body, html`<${MyComponent} someProp="value" />`);
```

### Class component

```javascript
import { html, innerHTML } from 'diffhtml';

class MyComponent {
  render(props) {
    return html`
      <div>Some prop = ${props.someProp}</div>
    `;
  }
}

innerHTML(document.body, html`<${MyComponent} someProp="value" />`);
```

<a name="lifecycle-hooks"></a>

---

## <a href="#lifecycle-hooks">Lifecycle hooks</a>

The following hooks will be called during the respective mounting and
unmounting flow. You do not need to extend from `Component` to use these hooks.
Simple classes can just define them as methods and they will be called.

### Hooks

#### `componentWillMount`

```js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

class WillMountComponent extends Component {
  render() {
    return html`
      <div><h1>Hello world</h1></div>
    `;
  }

  componentWillMount() {
    console.log('Component has mounted');
  }
}

innerHTML(document.body, html`<${WillMountComponent} />`);
```

#### `componentDidUpdate`

#### `componentWillReceiveProps`

#### `shouldComponentUpdate`

#### `componentWillUnmount`


<a name="component"></a>

---

## <a href="#component">Component</a>

The stateful class component, which is used by importing the `Component` class.

```js
import { Component } from 'diffhtml-components';
```

Once you have this base class, you can extend your ES6 class to get access to
sub-tree rendering. A component render result is treated as a fragment, and are
compared with previous results. All top-level elements are tracked and
efficient diffing is applied against the previously rendered contents.

```js
import { innerHTML, html } from 'diffhtml-components';
import { Component } from 'diffhtml-components';

class ListComponent extends Component {
  render({ items }) {
    return html`
      ${items.map(item => html`
        <li>${item}</li>
      `)}
    `;
  }
}

innerHTML(document.body, html`
  <ul>
    <${ListComponent} items=${['List item 1', 'List item 2']} />
  </ul>
`);
```

### Props

These are incoming values that map to the props you set using the element
attributes. Like in React, there will be a `children` prop automatically added
which maps to the passed in child elements. You can access props on
`this.props` or in the `render(props) {}` method.

### PropTypes

### State

#### forceUpdate

#### setState

<a name="web-component"></a>

---

## <a href="#web-component">Web Component</a>

The WebComponent implementation is nearly identical to the standard
[Component](#component), except `this` points to an HTML element, children are
rendered into the Shadow DOM, and when props and attributes are set on an
element that match `propTypes` cause an automatic re-render.

```js
import { WebComponent } from 'diffhtml-components';
```



<a name="jsx"></a>

---

## <a href="#jsx">JSX</a>

JSX is supported out-of-the-box.

<a name="react-compat"></a>

---

## <a href="#react-compat">React Compat</a>

This experimental module aims to replicate the public API surface-area of React
that is sufficient to execute and render components from that ecosystem. The
reason this is important, is that diffHTML should be able to adopt and help
contribute back to the community that it borrows so much from. It also helps
keep down the level of fragmentation required and initial investment if someone
wants to try out diffHTML in an existing React project.

You can install it by running:

```sh
npm install diffhtml-react-compat
```

---