diffHTML: A JavaScript View Layer
---------------------------------

Stable version: 0.9.2

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)
[![Coverage
Status](https://coveralls.io/repos/tbranyen/diffhtml/badge.svg?branch=master&service=github)](https://coveralls.io/github/tbranyen/diffhtml?branch=master) 
[![Join the chat at https://gitter.im/tbranyen/diffhtml](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/tbranyen/diffhtml)

diffHTML is a library that assists with creating user interfaces using
JavaScript. These interfaces can be: applications, games, data visualizations,
or anything else that you may want to render in a web browser.

This repository is a mono-repo structured with the [Lerna](https://lernajs.io/)
CLI tool. This makes it easier to support continuous integration, consistent
versioning, and working on the various diffHTML tools.

[**Click here to go directly to the diffHTML library source**](/packages/diffhtml/)

## Features

- Parses real **HTML** and supports **JSX** and **Tagged Templates**.
- Efficient minimal rendering that utilizes **object pooling**.
- **Web** and **React**-compatible stateful components.
- View and debug your code using the **Chrome DevTools extension**.
- **Transition hooks** monitor DOM changes an are similar to mutation events.
- Powerful **middleware** extends diffHTML with additional features.

## Packages

The following list of packages are nested in the `/packages` folder. They can
be tested globally or independently by using `npm test` at the root directory
level or any specific nested package level.

* **[diffhtml](/packages/diffhtml)**

  The core library for creating user interfaces. Contains a full build and
  smaller runtime build (which excludes HTML parser, tagged templates, and
  performance metrics).

* **[diffhtml-components](/packages/diffhtml-components)**

  Provides a React Like and identical Web Component API. If you're looking for
  the full React API, refer to the
  [diffhtml-react-compat](/packages/diffhtml-react-compat) package.

* **[diffhtml-middleware-logger](/packages/diffhtml-middleware-logger)**

  Logs out information at the start and end of every render transaction.

* **[diffhtml-middleware-synthetic-events](/packages/diffhtml-middleware-synthetic-events)**

  By default diffHTML uses inline event handlers like `onclick = fn`, this
  middleware uses `addEventListener` hooks to the `body` element and captures
  events using delegation.

* **[diffhtml-middleware-inline-transitions](/packages/diffhtml-middleware-inline-transitions)**

  By default diffHTML provides transition hooks at a global level. This
  middleware turns them into scoped, performant, event hooks.

* **[diffhtml-middleware-verify-state](/packages/diffhtml-middleware-verify-state)**

  Asserts that a render properly updated the old Virtual Tree and the DOM.
