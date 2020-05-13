# <±/> diffHTML Babel Transform Plugin

*Compiles your tagged template strings to Virtual Tree objects which reduces
runtime cost*

Stable Version: 1.0.0-beta.17

This plugin transforms tagged template strings containing HTML to
JSX/HyperScript-like function calls. By default it will use `diff.createTree`
which will need to be imported into your module. This works out-of-the-box with
the `diffhtml.js` and `diffhtml-runtime.js` UMD script files.

## Installation

``` javascript
npm i --save-dev babel-plugin-transform-diffhtml
```

## Simple example

Running:

```
babel test.js -o test.built.js --plugins=transform-diffhtml
```

Parses and transforms `test.js`:

``` js
class HelloWorld extends Component {
  render() {
    return html`
      <div>Hello world</div>
    `;
  }
}
```

into `test.built.js`:

``` js
var _vtree = diff.createTree("#text", "Hello world");

class HelloWorld extends Component {
  render() {
    return diff.createTree('#document-fragment', null, [
      diff.createTree('#text', '\n'),
      diff.createTree('div', {}, [_vtree]),
      diff.createTree('#text', '\n'),
    ]);
  }
}
```

## Recommend approach

A paved-path was designed to make authoring and optimizing markup easy. With
this approach you will not have typically JSX-like downsides, such as requiring
a build step, having to import a needless function like `React` or `h` (that
never gets used in your code).

To start, use ES modules (or CJS) to import the `html` tagged template helper:

``` js
import { html } from 'diffhtml';
```

Configure the babel plugin to find and replace with the same `html` value. The
runtime build which will be swapped in, automatically replaces the `html`
function with the `createTree` call. This saves you from needing to do a
needless import.

``` json
plugins: [
  ["transform-diffhtml", {
    "createTree": "html",
  }]
]
```

Lastly, make sure you alias the `diffhtml` import to `diffhtml/runtime` in your
bundler. Note: that this approach doesn't need a build step, since the tagged
template will work standalone. The bundler will trigger the babel pipeline and
give you a chance to reassign the import call to a different module.

### Browserify (you may want to point to the CJS distribution):

``` json
"aliasify": {
  "aliases": {
    "diffhtml": "diffhtml/dist/cjs/runtime"
  }
}
```

### Webpack:

``` json
"resolve": {
  "alias": {
    "diffhtml": "diffhtml/runtime"
  }
}
```

## Additional details

More specifically this plugin transforms tagged template strings, like:
(`html`&lt;div&gt;&lt;/div&gt;``), in your JavaScript files to flat strings
that get parsed by the HTML parser in diffHTML core. The dynamic values get
replaced with string tokens. This ensures consistency with the runtime parser.
From there they are stitched back together using the AST into a valid
JSX/HyperScript-like `h(tagName, props, ...childNodes)`. This is both a runtime
performance optimization as well as a build time since you can exclude more of
diffHTML from your build.

**Note!* This plugin has been built for use in Babel 6.x environments, and will
not work with Babel 5.x ( *deprecated*) or older versions.**

## How to use

Add the plugin to your `package.json` and update the plugin section in your
`.babelrc` file. Or if your Babel settings are located inside the
`package.json` - update the plugin section there.

You will then need to tag your diffHTML templates with the `html` function,
examples below. This will *only* optimize tagged templates, allowing you to
use the diffHTML runtime build avoiding runtime HTML parsing.

Example on a `.babelrc` file that will work with diffHTML:


``` javascript
{   
  "plugins": ["transform-diffhtml"]
}
```

Write a View `view.js`:

``` javascript
const { html, innerHTML } = require('diffhtml/runtime');

// Render a div with dynamic children and onclick
function renderTime(time) {
  innerHTML(document.body, html`
    <button onclick=${e => renderTime(new Date())}>Get time</button>
    <output>${time}</output>
  `);
}

renderTime(new Date());
```

Then compile it:

``` sh
babel view.js -o view.es5.js
```

The output will be:

``` js
const { html, innerHTML } = require('diffhtml/runtime');

// Render a div with dynamic children and onclick
function renderTime(time) {
  innerHTML(document.body, [diff.createTree("button", { "onclick": e => renderTime(new Date()) }, [diff.createTree('#text', "Get time")]), diff.createTree('#text', "\n    "), diff.createTree("output", {}, [diff.createTree(time)])]);
}

renderTime(new Date());
```

### Specifying options

You can override three identifiers that are used within the transform:

- **tagName** - The tagged template function name default is `html`.
- **createTree** - The create tree function default is `diff.createTree`

Specifying the options in your `.babelrc`:

``` javascript
{
  plugins: [
    ["transform-diffhtml", {
      "tagName": "html",
      "createTree": "createTree",
    }]
  ]
}
```

How your source would look reflecting the options:

``` javascript
import { innerHTML, html, createTree } from 'diffhtml';

function render() {
  return html`
    <div>Hello World</div>
  `;
}

innerHTML(document.body, render());
```

The output would look like:

``` js
const { innerHTML, html, createTree } = require('diffhtml/runtime');

function render() {
  return createTree("div", "Hello world");
}

innerHTML(document.body, render());
```
