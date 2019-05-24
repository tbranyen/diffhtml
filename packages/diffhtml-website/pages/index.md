**Welcome to diffHTML!** A library created for engineers, creatives, and pretty
much anyone interested in building interactive web applications. Lightweight
and easy-to-use, it is authored in standards-compliant ES6 JavaScript.

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

You can access any of the diffHTML source code from the following servers. The
"official" diffhtml.org is on a Linode and is only suitable for hobby projects
<u>DO NOT RELY</u> on it in production.

### Latest full version minified endpoints

Using this method will bring in the global minified UMD file. This includes the
parser so it will be larger than the runtime build weighing at around
**7.8kb min+gzip**. Access the API through the `window.diff` global.

- **https://diffhtml.org/master/diffhtml/dist/diffhtml.min.js**
- **https://unpkg.com/diffhtml/dist/diffhtml.min.js**

### Latest runtime version minified endpoints

If you use the [Babel transform](#optimizing-with-babel), you will be able to
use the runtime build instead.  This converts `html` tagged template calls into
`createTree` calls, which take in the Babel converted trees. This greatly
reduces the bundle sizes. The base bundle size here is just **6kb min+gzip**!

- **https://diffhtml.org/master/diffhtml/dist/diffhtml-runtime.min.js**
- **https://unpkg.com/diffhtml/dist/diffhtml-runtime.min.js**

### Installing into `node_modules`

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

### Script tag

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

### ES modules

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

_While `diffhtml` is the core package to install, there are many other modules
you may also want to install depending on your use cases. All of them are available
at the same CDN endpoints._

<a name="optimizing-with-babel"></a>

---

## <a href="#optimizing-with-babel">Optimizing with Babel</a>

While diffHTML is relatively small

Once you have a working project, you may want to take your code to the next
level and squeeze out even more performance. With the Babel transform, you can
write very clean and readable code, and then compile down to something much more
efficient. For instance, the plugin will automatically hoist static VTrees,
parse your HTML and build `createTree` calls avoiding the need for runtime
parsing, and output produced is directly compatible with the diffHTML/runtime
build (which removes the HTML parser code).

``` sh
npm install -D babel-plugin-transform-diffhtml
```

<a name="writing-middleware"></a>

---

## <a href="#writing-middleware">Writing middleware</a>

---
