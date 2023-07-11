# <±/> diffHTML

*The foundation and core of the diffHTML ecosystem. Parses HTML, reconciles
changes, applies middleware, handles transitions, and keeps the DOM in sync.*

Latest version: 1.0.0-beta.30

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
