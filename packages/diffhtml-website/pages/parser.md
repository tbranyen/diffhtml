# Parser

One of the best features of diffHTML is the parser. This drives the compiling
of declarative markup and supports a variety of syntaxes. You can make compound
documents that are comprised of HTML, SVG, or XML. The result is a VTree which
makes it equivalent to the `createTree` function. 

Usually production code does not run the parser. You will pre-compile your markup
using the [Babel transform](/tools.html#babel-transform) that also conveniently
uses the same parser to ensure parity.

The built in parser can read full HTML documents including comments, doctype,
html/head/body/title page tags, multiple unwrapped top-level root elements,
and has support for optional tags. It even supports nested markup within attributes,
such as <code>srcdoc="<some markup />"</code> in <code>&lt;iframe/&gt;</code>.

While the parser works for most use cases out-of-the-box, you may want to use
something else. The parser is overrideable and allows for any string-based
input, so long as it returns a DOM-like structure.

**Using with innerHTML:**

```js
import { innerHTML } from 'diffhtml';

// Using innerHTML will parse the HTML markup from a string literal.
innerHTML(document.body, '<div>Hello world</div>');
```

This produces a single top level element `<div/>` with a nested `#text` node.

If you were to structure your code like this:

```js
import { innerHTML } from 'diffhtml';

// Using innerHTML will parse the HTML markup from a string literal.
innerHTML(document.body, '<div>Hello world</div>');
```

This would become:

```js
import { createTree } from 'diffhtml';

innerHTML(document.body, createTree('div', null, [
  createTree('#text', 'Hello world')
]));
```

You'll notice the top-level element returned is 'div'. From there you may
think:

```js
import { innerHTML } from 'diffhtml';

// Using innerHTML will parse the HTML markup from a string literal.
innerHTML(document.body, `
  <div>Hello world</div>
`);
```

Would produce similar behavior, but it does not. The returned value mirrors
what is embedded precisely, becoming:

```js
import { createTree } from 'diffhtml';

innerHTML(document.body, createTree('#document-fragment', [
  createTree('#text', '\n'),
  createTree('div', null, [createTree('#text', 'Hello world')]),
  createTree('#text', '\n'),
]));
```

This can be useful knowledge for optimizing, but for more applications it
should be fine to keep them in for developer convenience.

**Using with outerHTML:**

```js
import { outerHTML } from 'diffhtml';

// Using outerHTML will parse the HTML markup and apply around the element.
outerHTML(document.body, `
  <body>Hello world</body>
`);
```

**Using with html:**

```js
import { html } from 'diffhtml';

// The tagged template will parse HTML in the same way, and also handle
// dynamic values directly.
console.log(html`
  <div>Hello world</div>
`);
```

**Using directly from Internals:**

```js
import { Internals } from 'diffhtml';

// This is the raw parse function which allows you to map dynamic values
// to either a TAG, ATTRIBUTE, or CHILD. You can find more information
// about this in the dynamic values section below.
console.log(Internals.parse(`
  <div>Hello world</div>
`));
```

<a name="options"></a>

---

## <a href="#options">Options</a>

The parser is somewhat configurable, allowing you to change the list of self
closing items. This could be useful to pair with the [HTML Linter
Middleware](/middleware.html#html-linter).

- [`rawElements`](#block-elements) - Modify the list of elements that have text values instead of markup
- [`voidElements`](#self-closing) - Modify the list of elements that can self close

<a name="block-elements"></a>

---

### <a href="#raw-elements">Raw elements</a>

A list of elements that have their contents treated as raw text, rather than
parsed as HTML. You can provide your own list of element names to allow this
feature.

Examples of these kinds of elements are: `<pre>`, `<code>`, `<script>`, `<style>`


<a name="self-closing-elements"></a>

---

### <a href="#self-closing-elements">Self closing elements</a>

A list of elements that are allowed to self close. You can provide your own list of
element names to allow this feature.

Examples of these kinds of elements are: `<meta/>`, `<hr/>`, `<img/>`

<a name="override"></a>

---

## <a href="#override-parser">Override parser</a>

The parser is a simple function that takes in a string and returns a VTree or DOM-like object structure. This
function can be changed by mutating the `Internals` object.

```js
import { Internals } from 'diffhtml';

Internals.parse = input => {
  // Convert the input into a tree-like structure following the VTree format
  return {
    rawNodeName: 'div', // this can be any JS value, represents the tag / component
    nodeName: 'div', // must be string, represents the DOM value
    nodeValue: '', // for comments and text nodes, represents the actual value of the node
    key: '', // used to identify a node when doing keyed renders
    attributes: {}, // key val of attributes or props
    childNodes: [], // children of this node
  };
};
```

<a name="dynamic-values"></a>

---

## <a href="#dynamic-values">Dynamic values</a>

The parser allows you to use dynamic values for many different parts of the
HTML syntax. This is primarily used with tagged template literals to support
the passing of objects and other JavaScript types.

You can put dynamic values in either: _tag_, _attribute_, or _children_ locations.
This makes it incredibly easy to compose dynamic template-driven UIs from your
JavaScript view layer.

```
<TAG ATTRIBUTE>CHILDREN</TAG>
```

When parsing diffHTML will create a "Supplemental" object, which contains the
keys: `tags`, `attributes`, `children`. This denotes the position in which the
value was located. The template is rewritten with the unique keys and then are
applied once the tree has been created.

In order to indicate that a given position should be swapped with a dynamic
value simply use the syntax: **&#95;&#95;DIFFHTML&#95;&#95;TOKEN&#95;&#95;**.
Where the **TOKEN** value is an arbitrary string value that will correlate to a
value provided to the parser. Every token must be completely unique. You cannot
guarantee that the parser won't try to determine automatically what type the
token belongs to. If a value is not found for the token, it will be left in
your source.

**An example setting each type of injection:**

```js
import { Internals, innerHTML } from 'diffhtml';

const vTree = Internals.parse(`
  <__DIFFHTML__TOKEN_0__ style=__DIFFHTML__TOKEN_1__>__DIFFHTML__TOKEN_2__</div>
`, {
  tags: {
    'TOKEN_0': 'div',
  },
  attributes: {
    'TOKEN_1': { fontWeight: 'bold' },
  },
  children: {
    'TOKEN_2': 'Custom style object',
  },
});

innerHTML(document.body, vTree);
```

---
