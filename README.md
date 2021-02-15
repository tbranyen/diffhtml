# <±/> diffHTML

[![Build Status](https://travis-ci.com/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)
[![Coverage
  Status](https://coveralls.io/repos/tbranyen/diffhtml/badge.svg?branch=master&service=github)](https://coveralls.io/github/tbranyen/diffhtml?branch=master)

Latest version: 1.0.0-beta.18

At its core, diffHTML is an extremely lightweight and optimized HTML parser and
Virtual DOM specifically designed for modern web UIs. These interfaces can be
applications, games, data visualizations, or anything else that you may want to
render in a web browser or Node.

The core works like a library, where you can import just one function and have
a fully reactive VDOM rendering engine. When you opt into more functions and
use the companion packages you get a framework for structuring your ideas.

## Features

- Parses real **HTML** and supports **JSX & Tagged Templates**.
- Memory efficient VDOM rendering that utilizes **object pooling**.
- **Transitions** for animations and hooking into DOM changes.
- Powerful **middleware** extends diffHTML with additional features.
- **Web** and **React**-compatible stateful components.
- View and debug your code using the **Chrome DevTools extension**.
- A **lite** build which has a smaller size, meant for optimizing production code.

## Packages

The following list of modules are nested in the `/packages` folder. They form
the foundation of the diffHTML ecosystem.

* [diffhtml](/packages/diffhtml)

  ```sh
  npm install diffhtml
  ```

  The core public API for creating user interfaces. Contains a standard build
  which includes everything, and a smaller optimized build that excludes the
  HTML parser and performance metrics, which is useful for those who want to
  minimize the filesize.

* [diffhtml-components](/packages/diffhtml-components)

  ```sh
  npm install diffhtml-components
  ```

  Provides constructors and middleware to rendering stateful/stateless
  components seamlessly with diffHTML. The API will be very familiar to anyone
  who has used React as the class methods and structure is the same. While the
  APIs are very similar, if you want true React compatibility, check out the
  [diffhtml-react-compat](/packages/diffhtml-react-compat) package.

* [babel-plugin-transform-diffhtml](/packages/babel-plugin-transform-diffhtml)

  ```sh
  npm install babel-plugin-transform-diffhtml
  ```

  Transforms your input into function calls. This eliminates the need for
  runtime parsing. This is similar to how React compiles down JSX.

* [diffhtml-middleware-inline-transitions](/packages/diffhtml-middleware-inline-transitions)

  ```sh
  npm install diffhtml-middleware-inline-transitions
  ```

  By default diffHTML provides transition hooks at a global level. This
  middleware turns them into scoped, performant, event hooks.

* [diffhtml-middleware-linter](/packages/diffhtml-middleware-linter)

  ```sh
  npm install diffhtml-middleware-linter
  ```

  This module will run various linting rules on your input to ensure you are
  writing valid/well-formed HTML. This was inspired by and uses rules from the
  [HTMLHint](https://htmlhint.com/) project.

* [diffhtml-middleware-logger](/packages/diffhtml-middleware-logger)

  ```sh
  npm install diffhtml-middleware-logger
  ```

  Logs out diffHTML state from the start and end of every render transaction.

* [diffhtml-middleware-synthetic-events](/packages/diffhtml-middleware-synthetic-events)

  ```sh
  npm install diffhtml-middleware-synthetic-events
  ```

  Changes the event binding from inline event handlers like `onclick = fn` to
  use `addEventListener`. Events are attached to the `body` element and
  coordinated to children through delegation.

* [diffhtml-middleware-verify-state](/packages/diffhtml-middleware-verify-state)

  ```sh
  npm install diffhtml-middleware-verify-state
  ```

  Asserts that a render properly updated the old Virtual Tree and the DOM. Will
  recursively search for inconsistencies, displays warnings unless debugging is
  enabled, then it throws errors instead.

* [diffhtml-middleware-service-worker](/packages/diffhtml-middleware-service-worker)

  ```sh
  npm install diffhtml-middleware-service-worker
  ```

  Helps with the creation of a service worker for PWAs, available as a
  convenience to make development more friendlier.

* [diffhtml-react-compat](/packages/diffhtml-react-compat)

  ```
  npm install diffhtml-react-compat
  ```

  **Highly Experimental:** This is a compatibility package meant to be a
  drop-in replacement for the modules: `react` and `react-dom`. It wraps the
  [diffHTML Components](/packages/diffhtml-components) package as the base for
  the component constructors. It then layers additional React-specific APIs.

* [diffhtml-static-sync](/packages/diffhtml-static-sync)

  ```
  npm install diffhtml-static-sync
  ```

  **Highly Experimental:** A work-in-progress static HTML server that automatically
  reloads your markup as you save using Web Sockets.

* [diffhtml-devtools](/packages/diffhtml-devtools)

  Chrome Extension providing DevTools for inspecting and learning more about
  your running diffHTML code. Currently logs information about transactions,
  allows toggling active middleware, and displays some memory internals.

* [diffhtml-website](/packages/diffhtml-website)

  The source for the [www.diffhtml.org](https://www.diffhtml.org) website.
