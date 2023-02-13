# Rust WASM HTML Parser

Provides [tl a Rust-based zero-copy HTML parser](https://docs.rs/tl/latest/tl/)
compiled to WASM, with a lightweight compatibility layer. This is an
alternative to the regex-based parser found in the core source. You can use
this alternative during a build, in the browser, and when writing server-side
code.

## Build

```
make
```

## Test

```
npm t
```

## Using with diffHTML

```js
import { Internals, innerHTML, html } from 'diffhtml';
import { parse } from 'diffhtml-rust-parser';

// Use the rust parser
Internals.parse = parse;

// Now the html`` tagged template will be parsed using WASM
innerHTML(document.body, html`
    <div>Parsed with TL using WASM</div>
`);

// Simple HTML strings are also automatically parsed using WASM now
innerHTML(document.body, '<div>Also parsed with WASM</div>');
```

## Using with the Babel plugin

To use the WASM plugin with you need to enable the Node WASM support as part of
your build step. This is done with the `NODE_OPTIONS` env var and the
`--experimental-wasm-modules` flag.

```json
{
    "scripts": {
        "build": "NODE_OPTIONS=--experimental-wasm-modules babel input.js -o output.js"
    }
}
```

You need to use the JS version of the Babel config in order to pass the dynamic
value. The JSON `.babelrc` is not compatible with the WASM parser.

A `babel.config.js` config could look something like:

```js
import { parse } from 'diffhtml-rust-parser';

export default {
  plugins: [
    ['transform-diffhtml', {
      parse,
    }]
  ],
};
```

## Using with Webpack

This module is generated with bundlers and Node in mind. You should be able to
consume it with a bundler that supports loading WASM like webpack. A sample
example of how you could integrate the WASM parser in both development and
production is available.

- [Sample webpack example](./examples/webpack)

