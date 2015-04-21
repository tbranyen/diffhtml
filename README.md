Element.prototype.diffHTML
--------------------------

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)

Allows you to easily swap out markup and have an intelligent virtual diff patch
in the changes.  Contrast to `innerHTML` that blows everything away when set.

``` javascript
document.querySelector('main').diffHTML = '<new markup to diff/>';
```

[More information and a demo are available on http://www.diffhtml.org/](http://www.diffhtml.org/)
