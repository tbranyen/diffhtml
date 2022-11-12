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
node --experimental-wasm-modules .
```

## Using with diffHTML

```js
import { innerHTML } from 'diffhtml';
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
