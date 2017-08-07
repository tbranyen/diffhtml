# <±/> diffHTML Babel Transform Plugin

*Pre-compiles your tagged template strings to reduce runtime cost*

Stable Version: 1.0.0-beta.8

This plugin transforms tagged template strings `html` in your projects to
`createTree` calls. By default it will use `diff.createTree` which will need to
be imported into your module. This works out-of-the-box with the `diffhtml.js`
and `diffhtml-runtime.js` UMD script files.

## Installation

``` javascript
npm i --save-dev babel-plugin-transform-diffhtml
```

## Quick demo

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
var _vtree = diff.createTree("#text", null, "Hello world");

class HelloWorld extends Component {
  render() {
    return diff.createTree("div", {}, [_vtree]);
  }
}
```

More specifically this plugin transforms tagged template strings
(`html`&lt;div&gt;&lt;/div&gt;``) in your JavaScript files to flat strings that
get parsed by the diffHTML HTML Parser. This ensures consistency with the
runtime parser. From there they are pieced back together using the AST into a
valid JSX/HyperScript-like `h(tagName, props, ...childNodes)`. This is both a
runtime performance optimization as well as a build time since you can exclude
more of diffHTML from your build.

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
  innerHTML(document.body, [diff.createTree("button", { "onclick": e => renderTime(new Date()) }, [diff.createTree('#text', null, "Get time")]), diff.createTree('#text', null, "\n    "), diff.createTree("output", {}, [diff.createTree(time)])]);
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
    ["transform-tagged-diffhtml", {
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
  return createTree("div", null, "Hello world");
}

innerHTML(document.body, render());
```
