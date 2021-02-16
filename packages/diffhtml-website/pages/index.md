**Welcome to diffHTML,** a lightweight library for creating fast and reactive
user interfaces using JavaScript. Using this tool you can create applications,
games, data visualizations, and much more! It is designed to be approachable to
new programmers, intermediates, and professionals.

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

<a name="getting-started"></a>

---

## <a href="#getting-started">Getting started</a>

<a name="node-module"></a>

### <a href="#node-module"><u>Package manager</u></a>

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

### <a href="#using-script-tag"><u>Script tag</u></a>

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>
<script>console.log(window.diff);</script>
```

<a name="es-modules"></a>

### <a href="#es-modules"><u>ES modules</u></a>

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml?module';
// or
import { innerHTML } from 'https://diffhtml.org/es';
```

<a name="examples"></a>

---

## <a href="#examples">Examples</a>

<!--

### Hello World

<div class="glitch-embed-wrap" style="height: 200px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-helloworld?path=hello-world.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-helloworld on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### Clock

<div class="glitch-embed-wrap glitch-clock" style="height: 300px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-clock?path=script.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-clock on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### Hacker News

<div class="glitch-embed-wrap glitch-clock" style="height: 300px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-hackernews?path=script.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-hackernews on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### TodoMVC

<div class="glitch-embed-wrap" style="height: 400px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/diffhtml-todomvc?path=lib/index.js&previewSize=100&attributionHidden=true&previewFirst=true&sidebarCollapsed=true"
    title="diffhtml-todomvc on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>
-->
