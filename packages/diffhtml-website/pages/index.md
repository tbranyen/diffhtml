**Welcome to diffHTML!** A lightweight library for creating fast and reactive
user interfaces using JavaScript. With diffHTML you can create applications,
games, data visualizations, and much more in you web browser.


<a name="hello-world"></a>

---

## <a href="#hello-world">Hello world!</a>

```js
import { innerHTML } from '//diffhtml.org/es';

innerHTML(document.body, `
  <h1>Hello world!</h1>
`);
```

<a name="core-features"></a>

---

## <a href="#core-features">Core features</a>

- <span class="list-icon fa fa-exchange"></span> ESM/CJS/UMD + Minified builds
- <span class="list-icon fa fa-retweet"></span> Async transition hooks
- <span class="list-icon fa fa-link"></span> Middleware
- <span class="list-icon fa fa-code"></span> Efficient Virtual DOM
- <span class="list-icon fa fa-recycle"></span> Object pooling to optimize GC
- <span class="list-icon fa fa-codiepie"></span> Automatic memory management
- <span class="list-icon fa fa-pencil"></span> Strict mode TypeScript via checkJS

<a name="getting-the-source"></a>

---

## <a href="#getting-the-source">Getting the source</a>

<a name="node-module"></a>

### <a href="#node-module">Package manager</a>

<div id="install"></div>

* <svg viewBox="0 0 18 7" width="40" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  ``` sh
  npm install --save diffhtml
  ```

* <img width="60" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

<a name="using-script-tag"></a>

### <a href="#using-script-tag">Script tag</a>

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>
<script>console.log(window.diff);</script>
```

<a name="es-modules"></a>

### <a href="#es-modules">ES modules</a>

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml?module';
// or
import { innerHTML } from 'https://diffhtml.org/es';
```
