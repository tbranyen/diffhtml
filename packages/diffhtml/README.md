# <±/> diffHTML

*The core diffHTML library. Parses HTML, reconciles changes, applies
middleware, handles transitions, and keeps the DOM in sync.*

Stable version: 1.0.0-beta.11

Refer to the website [https://diffhtml.org/](https://diffhtml.org/) for
documentation.

## Installation

``` javascript
npm i --save diffhtml
```

## Simple example

Render "Hello world" to the screen:

```javascript
import { innerHTML } from 'diffhtml';

innerHTML(document.body, `
  <div>Hello world</div>
`);
```
