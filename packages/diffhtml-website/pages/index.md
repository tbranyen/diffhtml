**Welcome to diffHTML!** A library created for anyone wanting to build a
reactive web application. Lightweight and easy-to-use, it is authored in
standards-compliant ES6 JavaScript.

You would use it in the same way as other web frameworks such as:
[React](https://reactjs.org/), [Vue](https://vuejs.org/), and
[Svelte](https://svelte.dev/). You may want to look at these first, as they are
backed by corporations and/or large communities.  

<a name="core-features"></a>

---

## <a href="#core-features">Core features</a>

- <span class="list-icon fa fa-exchange"></span> ES/CJS/UMD module support
- <span class="list-icon fa fa-retweet"></span> Async transition hooks
- <span class="list-icon fa fa-link"></span> Middleware
- <span class="list-icon fa fa-code"></span> Efficient Virtual DOM
- <span class="list-icon fa fa-tree"></span> Virtual tree object pooling
- <span class="list-icon fa fa-codiepie"></span> Automatic memory management

<a name="installing-and-importing"></a>

---

## <a href="#installing-and-importing">Installing & importing</a>

The source code is authored in valid ES6 and can be run without a transpiler
in JavaScript runtimes that support the latest specification. The minified
version can be run in an ES5 environment as it runs through a separate build
step to make it compatible with UglifyJS.

<a name="latest-full-version"></a>

### <a href="#latest-full-version">Latest full version minified endpoints</a>

Using this method will bring in the global minified UMD file. This includes the
parser so it will be larger than the runtime build weighing at around
**7.8kb min+gzip**. Access the API through the `window.diff` global.

- **https://diffhtml.org/master/diffhtml/dist/diffhtml.min.js**
- **https://unpkg.com/diffhtml/dist/diffhtml.min.js**

<a name="latest-runtime-version"></a>

### <a href="#latest-runtime-version">Latest runtime version minified endpoints</a>

If you use the [Babel transform](#optimizing-with-babel), you will be able to
use the runtime build instead.  This converts `html` tagged template calls into
`createTree` calls, which take in the Babel converted trees. This greatly
reduces the bundle sizes. The base bundle size here is just **6kb min+gzip**!

- **https://diffhtml.org/master/diffhtml/dist/diffhtml-runtime.min.js**
- **https://unpkg.com/diffhtml/dist/diffhtml-runtime.min.js**

<a name="installing-node-modules"></a>

### <a href="#installing-node-modules">Installing into `node_modules`</a>

JavaScript package management uses this folder and there are two many different
clients that can install into. Two recommended ones are shown below:

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

This will create the following structure:

```
node_modules/diffhtml
├── dist
│   ├── cjs # where all the CommonJS files are
│   ├── diffhtml.js
│   ├── diffhtml.min.js
│   ├── diffhtml-runtime.js
│   ├── diffhtml-runtime.min.js
│   └── es # where all the ESM files are
├── lib
├── package.json
└── README.md
```

<a name="using-script-tag"></a>

### <a href="#using-script-tag">Using a script tag</a>

Use this tag in HTML to load diffHTML globally.

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>

<script>
  const { innerHTML } = window.diff;
</script>
```

Loading just the runtime:


```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml-runtime.min.js"></script>
```

<a name="es-modules"></a>

### <a href="#es-modules">ES modules</a>

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml?module';
```

To load just the runtime:

``` javascript
import { innerHTML } from 'https://unpkg.com/diffhtml/runtime?module';
```

### <a name="using-import-maps" href="#using-import-maps">Using import maps</a>

[Import maps](https://github.com/WICG/import-maps) are a new new feature
available in modern Chrome that allow you to specify a configuration to import
global names instead of using URLs or file paths directly.

For instance, you can convert:

```js
import { innerHTML } from 'https://diffhtml.org/es';
```

Into:

```js
import { innerHTML } from 'diffhtml';
```

Which will resolve to the same URL.

This is accomplished by adding a script tag to your web application that
specifies the configuration as JSON. And looks something like this:

```html
<script type="importmap">
{
  "imports": {
    "diffhtml": "https://diffhtml.org/es",
    "diffhtml/components": "https://diffhtml.org/master/diffhtml-components/dist/es"
  }
}
</script>
```

Remember this is JSON so you cannot have trailing commas or use single quotes.
It is also currently limited to being inline with the markup, it cannot be an
external file.

<a name="optimizing-with-babel"></a>

---

## <a href="#optimizing-with-babel">Optimizing with Babel</a>

<a href="https://github.com/tbranyen/diffhtml/tree/master/packages/babel-plugin-transform-diffhtml">
  <i class="fa fa-github" />
  GitHub repo link
</a>

The Babel plugin is useful after you have a working project and wish to
optimize it further. The Babel plugin will perform numerous optimizations to
your code depending on how it is written and structured. For instance, anytime
you have an element that does not change it will be hoisted and reused instead
of recreated every time. Any `html` tagged template calls will be converted to
`createTree` calls. After code has been run through this plugin you will be
able to pair with the [runtime build](#runtime-build).

and enable the use of the runtime build
which decreases the file size further.

To use, install into your project as a dev dependency.

``` sh
npm install -D babel-plugin-transform-diffhtml
```

Specify the plugin in the Babel configuration, usually a `.babelrc` or
`babel.config.js` file:

```json
{
  "plugins": ["babel-plugin-transform-diffhtml"]
}
```

[Refer to the configuration documentation.](https://github.com/tbranyen/diffhtml/tree/master/packages/babel-plugin-transform-diffhtml#-diffhtml-babel-transform-plugin)

<a name="runtime-build"></a>

---

## <a href="#runtime-build">Runtime build</a>

The runtime configuration is a custom build that removes the HTML parser,
performance instrumentation, and is a much smaller build.

This is better for production scenarios when you want to get the best
performance and the lowest filesize.


<a name="writing-middleware"></a>

---

## <a href="#writing-middleware">Writing middleware</a>

You would write middleware when you want to extend diffHTML in ways that it was
not originally intended. For instance, you could use middleware to 

---
