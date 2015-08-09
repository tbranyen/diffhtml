diffhtml
--------

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)

Allows you to easily swap out markup and have an intelligent virtual diff patch
in the changes.  Contrast to `innerHTML`/`outerHTML` which destroys and creates
all elements when set.

##### Diff an element and all children

``` javascript
document.querySelector('main').diffOuterHTML = '<new markup to diff/>';
```

##### Diff an element's children

``` javascript
document.querySelector('main').diffInnerHTML = '<new child markup to diff/>';
```

##### Diff two elements

``` javascript
var newElement = document.createElement('main');
newElement.innerHTML = '<div></div>';

document.querySelector('main').diff = newElement;
```

[More information and a demo are available on http://www.diffhtml.org/](http://www.diffhtml.org/)
