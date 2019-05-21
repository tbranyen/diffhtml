**Welcome to diffHTML!** A library created for web engineers and creatives to
build interactive applications. Lightweight and easy-to-use, it is authored in
standards-complaint ES6 JavaScript.

You would use it in the same way as other web frameworks such as:
[React](https://reactjs.org/), [Vue](https://vuejs.org/), and
[Svelte](https://svelte.dev/). You may want to look at these first, as they are
backed by corporations and/or large communities.  

<a name="core-features"></a>

---

## <span>Core features</span>

- <span class="list-icon fa fa-exchange"></span> ES/CJS/UMD module support
- <span class="list-icon fa fa-retweet"></span> Async transition hooks
- <span class="list-icon fa fa-link"></span> Middleware
- <span class="list-icon fa fa-code"></span> Efficient Virtual DOM
- <span class="list-icon fa fa-tree"></span> Virtual Tree object pooling
- <span class="list-icon fa fa-codiepie"></span> Automatic memory management

<a name="installing-and-importing"></a>

---

## <span>Installing and importing</span>

Depending on your use case you may have to install from a registry using a
package manager or you can reference it directly from a server.

### Script tag

Using this method will bring in the global minified UMD file. This includes the
parser so it will be larger than the runtime build weighing at around
**7.8kb min+gzip**. Access the API through the `window.diff` global.

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml.min.js"></script>

<script>
  const { innerHTML } = window.diff;
</script>
```

If you use the [Babel transform](#optimizing-with-babel), you will be able to
use the runtime build instead.  This converts `html` tagged template calls into
`createTree` calls, which take in the Babel converted trees. This greatly
reduces the bundle sizes. The base bundle size here is just **6kb min+gzip**!

```html
<script src="https://unpkg.com/diffhtml/dist/diffhtml-runtime.min.js"></script>
```

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

### ES modules

You can import diffHTML directly over HTTP using the ES modules syntax. This is
a new feature that isn't available in all browsers yet, but you can use them
[safely in nearly all modern browsers](https://caniuse.com/#search=modules).

#### > diffhtml.org server

Hosted on my Linode, don't rely on this for complete stability, but it supports
**http/2** push so it's great for development. I'll always update this to
guarentee to be the latest version. Consider this "bleeding edge", if you need
stability use **unpkg** below.

``` javascript
// When you're loading from https, you can go protocol-less.
import { innerHTML } from '//diffhtml.org/es';

// When you're loading from file: or http:
import { innerHTML } from 'https://diffhtml.org/es';
```

#### > unpkg.com server

Sometimes outdated, cold start is sometimes slow, doesn't have **http/2**, but
is significantly more stable, so think of this as stable LTS.

``` javascript
import { innerHTML } from '//unpkg.com/diffhtml?module';
```

diffHTML is designed to be portable, so you can consume it in a number of ways
depending on your environment. You can load imports  works well with or without a build tool. It
can be laode dby browsers with the ES Module syntax.
 
There are many ways of getting diffHTML. It has been designed to be flexible
and the smallest filesize possible.

* **HTTP (Recommended for Beginners):**

  ```
  <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.js"></script>
  ```

_While `diffhtml` is the core package to install, there are many other modules
you may also want to install depending on your use cases._

<a name="optimizing-with-babel"></a>

---

## <span>Optimizing with Babel</span>

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

## <span>Writing middleware</span>
