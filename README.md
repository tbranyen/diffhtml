diffhtml
--------

[![Build Status](https://travis-ci.org/tbranyen/diffhtml.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml)

Allows you to easily swap out markup and have an intelligent virtual diff patch
in the changes.  Contrast to `innerHTML`/`outerHTML` which destroys and creates
all elements when set.

#### Install

``` sh
npm install diffhtml
```

The module can be required via Node or browser environments.  It is exported as
a global named `diff`.

#### API

The exposed API provides the following methods:

- [outerHTML(element, markup)](#user-content-diff-an-element-with-markup)
- [innerHTML(element, markup)](#user-content-diff-an-elements-children-with-markup)
- [element(oldElement, newElement)](#user-content-diff-an-element-to-another-element)
- [enableProllyfill()](#user-content-prollyfill)

##### Diff an element with markup

##### Diff an element's children with markup

##### Diff an element to another element

#### Prollyfill

I'd love to see this project become a browser standard in the future.  To
enable how I'd envision it working, simply call `enableProllyfill();` on the
diff object.

This will augment the `Element.prototype` and 

``` javascript
diff.enableProllyfill();
```

Now you can use the API defined below.

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
