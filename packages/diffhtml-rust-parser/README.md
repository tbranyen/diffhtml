# Rust HTML Parser

Allows using a Rust-based zero-copy HTML parser, instead of the regex-based
parser found in the JS source. This is an alternative that can be used during
a build, in the browser, when writing server-side code, and when implementing
diffHTML in other languages.

## Build

```
make
```

## Test

```
node --experimental-wasm-modules .
```
