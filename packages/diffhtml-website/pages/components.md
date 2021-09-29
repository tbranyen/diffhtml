# Components <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml-components"><i class="fa fa-github"></i></a>

Components are useful to organize and reuse distinct parts of your interface.

<a name="overview"></a>

---

## <a href="#overview">Overview</a>

Components support is provided by a plugin and must be installed and imported
before they will work. The middleware provided by the plugin supports functions,
classes, and web components.

``` sh
npm install --save diffhtml-components
```

<a name="function-component"></a>

---

## <a href="#function-component">Function component</a>

```javascript
import 'diffhtml-components';
import { html, innerHTML } from 'diffhtml';

function MyComponent(props) {
  return html`
    <div>Some prop = ${props.someProp}</div>
  `;
}

innerHTML(document.body, html`<${MyComponent} someProp="value" />`);
```

<a name="class component"></a>

---

## <a href="#class-component">Class Component</a>

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

These components can be registered as Custom Elements, making them Web
Components.

<a name="component-props"></a>

### <a href="#component-props"><u>Props</u></a>

These are incoming values that map to the props you set using the element
attributes. Like in React, there will be a `children` prop automatically added
which maps to the passed in child elements. You can access props on
`this.props` or in the `render(props) {}` method.

<a name="component-state"></a>

### <a href="#component-state"><u>State</u></a>

#### forceUpdate

#### setState

<a name="lifecycle-hooks"></a>

### <a href="#lifecycle-hooks"><u>Lifecycle hooks</u></a>

The following hooks will be called during the respective mounting and
unmounting flow. You do not need to extend from `Component` to use these hooks.
Simple classes can just define them as methods and they will be called.

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

```js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DidUpdateComponent extends Component {
  render() {
    return html`
      <div><h1>Hello world</h1></div>
    `;
  }

  componentDidUpdate() {
    console.log('Component was updated');
  }
}

innerHTML(document.body, html`<${WillMountComponent} />`);
```

#### `componentWillReceiveProps`

#### `shouldComponentUpdate`

#### `componentWillUnmount`



<a name="create-state"></a>

---

## <a href="#create-state">createState</a>

The function `createState` is used to make a stateful component out of a
function component. It mimics the API of `useState` from React. Essentially you
must execute this function in the same spot at the same time every render.

<a name="create-state-examples"></a>

### <a href="#create-state-examples"><u>Examples</u></a>

```javascript
import { innerHTML, html } from 'diffhtml';
import { createState } from 'diffhtml-components';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [ count, setCount ] = createState(0);

  return html`
    <div>
      <p>You clicked ${String(count)} times</p>
      <button onClick=${() => setCount(count + 1)}>Click me</button>
    </div>
  `;
}

innerHTML(main, html`<${Example} />`);
```

<a name="jsx"></a>

---

## <a href="#jsx">JSX</a>

JSX is supported out-of-the-box. You will need to configure your compiler to
use `createTree`, or alias it to `h` or whatever is expected.

```jsx
import { createTree as h } from 'diffhtml';

function SomeComponent() {
  return (
    <>
      <div>Using JSX</div>
      <span onClick={() => console.log('clicked')}></span>
    </>
  );
}
```