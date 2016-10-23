# diffHTML Babel Plugin

Latest stable version: 1.0.0-rc.4

[![Build Status](https://travis-ci.org/tbranyen/transform-tagged-diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/transform-tagged-diffhtml)

> Plugin for babel 6.x to enable tagged template compilation for diffHTML

This plugin transforms tagged template strings in your projects to
[diffHTML](https://github.com/tbranyen/diffhtml) Virtual Tree's. 

**Note!* This plugin has been built for use in Babel 6.x environments, and will
not work with Babel 5.x ( *deprecated*) or older versions.**

### How to install

``` javascript
npm i --save-dev diffhtml transform-tagged-diffhtml
```

### How to use

Add the plugin to your `package.json` and update the plugin section in your
`.babelrc` file. Or if your Babel settings are located inside the
`package.json` - update the plugin section there.

You will then need to tag your diffHTML templates with the `html` function,
examples below. This will *only* optimize tagged templates, allowing you to
use the diffHTML runtime build avoiding runtime HTML parsing.

Example on a `.babelrc` file that will work with diffHTML:


``` javascript
{   
  "plugins": ["transform-tagged-diffhtml"]
}
```

Write a View `view.js`:

``` javascript
// Render a div with dynamic children and onclick
function renderComponent(time) {
  diff.innerHTML(document.body, html`
    <button onclick=${e => renderComponent(new Date())}>Get time</button>
    <output>${time}</output>
  `);
}

renderComponent(new Date());
```

Then compile it:

``` sh
babel view.js -o view.es5.js
```


### Specifying options

You can override three identifiers that are used within the transform:

- **tagName** - The tagged template function name default is `html`.
- **createElement** - The create element function default is `diff.createElement`
- **createAttribute** - The create attribute function default is `diff.createAttribute`


Specifying the options in your `.babelrc`:

``` javascript
{
  plugins: [
    ["transform-tagged-diffhtml", {
      "tagName": "diff.html",
      "createElement": "createEl",
      "createAttribute": "createAttr"
    }]
  ]
}
```

How your source would look reflecting the options:

``` javascript
import {
  createElement as createEl,
  createAttribute as createAttr,
} from 'diffhtml';

diff.html`
  <div></div>
`;
```
