diffHTML Logger
---------------

Stable Version: 1.0.0

Use with diffHTML to log out patch operations.

##### Installation

``` sh
npm install diffhtml-logger
```

##### Example

``` javascript
import logger from 'diffhtml-logger';

diff.use(logger());
```

##### Filtering out the type of patches

If you want to debug only element patches, you can provide a filter as an
option:

``` javascript
diff.use(logger({
  // Log all element mutations, this excludes text and attribute changes.
  filterPatches(patch) {
    return patch.type.indexOf('ELEMENT') > -1;
  }
}));
```

##### Screenshot

![middleware](https://cloud.githubusercontent.com/assets/181635/16064150/8a7b3e6c-3253-11e6-8e0f-5e511ec2b588.png)

This is not a very performant middleware, so please do not use this in
production where performance is critical. Use in development.
