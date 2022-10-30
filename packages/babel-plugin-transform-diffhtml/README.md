# <±/> babel-plugin-transform-diffhtml

*Babel transform for pre-parsing and compiling diffHTML template functions to
createTree calls which reduces runtime HTML parse cost.*

Latest version: 1.0.0-beta.29

Refer to the website [https://diffhtml.org/tools.html#babel-transform](https://diffhtml.org/tools.html#babel-transform) for documentation.

## Installation

Using npm:

```sh
npm install --save-dev babel-plugin-transform-diffhtml
```

or using yarn:

```sh
yarn add babel-plugin-transform-diffhtml --dev
```

## Simple example

`.babelrc`:

```json
{
  "plugins": [
    ["babel-plugin-transform-diffhtml", { "createTree": "_diffhtml.html" }]
  ]
}
```

`input.js`:

```js
import { innerHTML, html } from 'diffhtml';

function main() {
  innerHTML(document.body, html`
    <div><h1>Hello world</h1></div>
  `);
}

main();
```

`babel input.js`:

```
var _vtree = _diffhtml.html("#text", "Hello world");

import { innerHTML, html } from 'diffhtml';

function main() {
  innerHTML(document.body, _diffhtml.html("div", {}, [_diffhtml.html("h1", {}, [_diffhtml.html("#text", "Hello world")])]));
}

main();
```

You may need to tweak the "createTree" option to get the appropriate output in
the source to match how diffHTML is embedded and what build system you used.