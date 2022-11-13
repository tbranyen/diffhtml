# Webpack WASM Example

This example demonstrates how to build the WASM parser into a web bundle using
webpack.

In development `npm run start` or `npm run build-dev`:

- Build output is ~240KB
- WASM is loaded asynchronously
- Uses dev-server with `start`, outputs to the filesystem with `build-dev`

In production `npm run build`:

- Build output is ~20KB (7KB gzip)
- Removes the parser resulting in a significantly smaller filesize
- Uses Babel to pre-compile using the WASM parser to maintain consistency
