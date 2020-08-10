# <±/> diffHTML Linter Middleware

Stable Version: 1.0.0-beta.18

Use to validate your markup for inconsistencies and bad practices using
[HTMLHint](https://github.com/htmlhint/HTMLHint) rules.

##### Installation

``` sh
npm install diffhtml-middleware-linter
```

##### Example

``` javascript
import { use } from 'diffhtml';
import linter from 'diffhtml-middleware-linter';

use(linter());
```
