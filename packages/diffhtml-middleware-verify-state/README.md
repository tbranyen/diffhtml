```sh
npm install diffhtml-verify-state
```

```js
import { use } from 'diffhtml';
import { verifyState } from 'diffhtml-verify-state';

// throw when ?debug is set
use(verifyState({ debug: location.search.includes('debug') }));
```
