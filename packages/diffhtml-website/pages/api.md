# API

## innerHTML (element, markup='', options={})

Used to replace the
[innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
of an HTML element with passed in markup. This is what bridges diffHTML to the
page document. While you can dive head first into this function, you can also
take it slow and work your way up to something more complex.

For instance the easiest way to start is by using simple HTML strings and
diffing into the body element.

``` js
innerHTML(document.body, 'Hello world');
```

To see how to run this example yourself see the [Examples](#examples) section
below.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

#### element

*Reference element.*

This argument is overloaded. Can be one of many types:

- HTML Element / DOM Node (Used interchangeably)
- Virtual Tree Element (produced from `diff.html`)

#### markup

*New element.*

This argument is overloaded. Can be one of many types:

- JavaScript string containing HTML (like those produced from any template engine)
- DOM Node
- Virtual Tree Element (produced from `diff.html` or `diff.createTree`)
- JavaScript array containing DOM Nodes,Virtual Tree Elements, or JSX
- JSX via (`h(tagName, attributes, ...children)`)

#### options

*Optional: Advanced usage for render transaction manipulation.*

- `tasks` - Custom array of tasks to run. The default behavior is to parse the
  input and patch the changes into the DOM Node. The runtime behavior is to
  normalize the input (but not parse HTML), and patch the changes into the DOM
  Node. You can override this behavior by changing this array. This is not
  recommended as there is as a middleware API to achieve custom behavior during
  a render.

### Example (UMD)

A common way to access `innerHTML` is via
[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
from the globally exported `diff` object. Remember to wrap your code in a block
`{}` to prevent leaking the variables globally.

``` js
{
  const { innerHTML } = diff

  innerHTML(document.body, '<span>Hello world</span>')
}
```

Or if you prefer you can access the property directly.

``` js
diff.innerHTML(document.body, '<span>Hello world</span>')
```

### Example (Latest ES Specification)

## release (domNode)

### Purpose

Used to completely clean up references internally. Typically you render into
an element on the page and let diffHTML control everything around or inside it,
but the element itself is never removed. This method is useful in the case
where the element is removed.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

#### domNode

*Reference element.*

This argument is overloaded. Can be one of many types:

- HTML Element / DOM Node (Used interchangeably)
- Virtual Tree Element (produced from `diff.html`)

### Example (UMD)

A common way to access `innerHTML` is via
[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
from the globally exported `diff` object. Remember to wrap your code in a block
`{}` to prevent leaking the variables globally.

``` js
{
  const { release } = diff
  release(document.body)
}
```

Or if you prefer you can access the property directly.

``` js
diff.innerHTML(document.body, '<span>Hello world</span>')
```

### Example (Latest ES Specification)

