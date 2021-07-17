# Parser

A core feature of diffHTML is the HTML/XML/SVG parser. This is used whenever
you pass a string of markup or [use the html tagged template](/api.html#html)
to [innerHTML](/api.html#inner-html)/[outerHTML](/api.html#ouuter-html). While
this code is optimized specifically for the VDOM and is very fast, you may want
to optimize out the parser using the [Babel
plugin](/tools.html#babel-transform).

The parser can read full HTML documents including doctype, html/head/body/title
etc tags, unwrapped fragments, and more!

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

The parser is somewhat configurable, allowing you to opt into a strict-mode for
erroring if invalid markup is passed. This could be useful to pair with the
[HTML Linter Middleware](/middleware.html#html-linter).

- [`strict`](#strict-mode) - Toggle strict mode parsing
- [`rawElements`](#block-elements) - Modify the list of elements that have raw values
- [`selfClosingElements`](#self-closing) - Modify the list of elements that can self close

<a name="strict-mode"></a>

---

### <a href="#strict-mode">Strict mode</a>

By default the parser operates in loose-mode which is forgiving of missing
closing tags, poor markup, and other common issues. When opting into strict
mode you will receive errors if you don't properly self close tags, have
mismatched tag names, etc.

```js
import { innerHTML } from 'diffhtml';

const options = {
  parser: {
    strict: true,
  }
};

// Will be fine since the elements match
innerHTML(document.body, `
  <h1>Hello world</h1>
`, options);

// Will throw since the elements do not match
innerHTML(document.body, `
  <h1>Hello world</h2>
`, options);
```

Unlike the other two options below, this feature can be configured using the
tagged template [`html`](/api.html#html) directly.

```js
import { html } from 'diffhtml';

// Will throw an error due to the tag mismatch
html.strict`
  <p></div>
`;
```

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
keys: `tags`, `attributes`, `children`. Denoting the position in which the
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