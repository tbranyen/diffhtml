diffhtml
--------

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)

Allows you to easily swap out markup and have an intelligent virtual diff patch
in the changes.  Contrast to `innerHTML`/`outerHTML` which blow all elements
away when set.

##### Modify an element and all children

``` javascript
document.querySelector('main').diffOuterHTML = '<new markup to diff/>';
```

##### Modify an element's children

``` javascript
document.querySelector('main').diffInnerHTML = '<new child markup to diff/>';
```

[More information and a demo are available on http://www.diffhtml.org/](http://www.diffhtml.org/)
