diffHTML Middleware Inline Transitions
--------------------------------------

Stable Version: 1.0.0-beta.3

Tiny module to support binding/unbinding declarative diffHTML transition hooks.

##### Installation

``` sh
npm install diffhtml-middleware-inline-transitions
```

##### Use

``` js
import { use } from 'diffhtml';
import inlineTransitions from 'diffhtml-middleware-inline-transitions';

use(inlineTransitions());
```

##### Example

Apply to an element by passing the function to the associated state name:

``` js
import $ from 'jquery';
import { innerHTML, html, use } from 'diffhtml';
import inlineTransitions from 'diffhtml-middleware-inline-transitions';

// Enable the monitoring of attributes for changes.
use(inlineTransitions());

// Use jQuery to return a promise and fade in the body and paragraph.
function fadeIn(body, domNode) {
  return $(domNode).fadeOut(0).fadeIn(1000).promise();
}

innerHTML(document.body, html`<body onattached=${fadeIn}>
  <p>Watch me fade in slowly!</p>
</body>`);
```

Full events and args list:

| Event Name           | Args
| :------------------- | :----------------------------------------------------------
| `onattached`         | `(eventTarget, domNode)`
| `ondetached`         | `(eventTarget, domNode)`
| `onreplaced`         | `(eventTarget, oldNode, newNode)`
| `onattributechanged` | `(eventTarget, oldNode, attributeName, oldValue, newValue)`
| `ontextchanged`      | `(eventTarget, oldNode, oldValue, newValue)`
