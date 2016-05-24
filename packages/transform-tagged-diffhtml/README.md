# diffHTML Babel Plugin

> Plugin for babel 6.x to enable tagged template compilation for diffHTML

This plugin transforms tagged template strings in your projects to
[diffHTML](https://github.com/tbranyen/diffhtml) Virtual Tree's. 

**Note!* This plugin has been built for use in Babel 6.x environments, and will
not work with Babel 5.x ( *deprecated*) or older versions.**

## How to install

```js
npm i --save-dev babel-plugin-diffhtml

```

## How to use

Add the plugin to your `package.json` and update the plugin section in your
`.babelrc` file. Or if your Babel settings are located inside the
`package.json` - update the plugin section there.

Example on a `.babelrc` file that will work with diffHTML:


```js
{   
  "plugins": ["babel-plugin-diffhtml"]
}
```

## Examples    

``` javascript
// Render a simple div
diff.innerHTML(document.body, html`<div></div>`); 

// Render a div with text
diff.innerHTML(document.body, html`<div>Hello world</div>`);

// Render a div with dynamic children and onclick
function render(time) {
  diff.innerHTML(document.body, html`
    <button onclick=${e => render(new Date())}>Get time</button>
    <output>${time}</output>
  `);
}

render(new Date());
```
