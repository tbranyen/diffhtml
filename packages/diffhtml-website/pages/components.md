# Components

While you can build many great things with diffHTML core alone, an improved way
of structuring your creations is through the notion of a Component. The
Component will consolidate a section of your UI and make it re-usable and
encapsulated. Over the years many different "component" interfaces have been
created, but the most popular, which diffHTML is based off of, is React's.

<a name="overview"></a>

---

## <a href="#overview">Overview</a>

This package contains middleware to render components in diffHTML. A nice
feature is that you can use any class or function to render a component. So
long as the function or a render method on the class returns a string, VTree,
or DOM Node. The function and class used in this way do not have state and
cannot influence how they re-render.

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

<a name="component"></a>

---

## <a href="#component">Component</a>

<a name="web-component"></a>

---

## <a href="#web-component">Web Component</a>

<a name="jsx"></a>

---

## <a href="#jsx">JSX</a>

<a name="react-compatibility"></a>

---

## <a href="#react-compatibility">React Compatibility</a>

---
