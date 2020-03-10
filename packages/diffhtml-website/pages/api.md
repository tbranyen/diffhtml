# API

This reference contains all stable API documentation which is up-to-date with
the latest release. The core was designed to be minimal and familiar if you've
used browser DOM APIs such as `innerHTML` and `addEventListener`.

You can access any of the top-level API methods & properties by directly
importing or deconstructing.

<a name="inner-html"></a>

---

## <a href="#inner-html">innerHTML</a> **`(domNode, markup, options)`**

Replaces the contents of a DOM node with the passed in markup, but will only
update changed content and structure. Works like the browser's `innerHTML` only
changing the element's children, but not the containing element. If you want to
control the entire tag, use [`outerHTML`](#outer-html).

### Arguments

| Name        | Description
| ----------- | -----------
| **domNode** | The root DOM Node to change the child contents of, but not the element itself.
| **markup**  | New markup to replace into **domNode**. 
| **options** | <ul><li><strong>tasks:</strong> An array of tasks to run. Can swap these out completely to run custom logic instead.</li><li><strong>parser:</strong> Settings which influence the HTML parser. No parser settings available in the runtime build.</li></ul>

### Example

``` js
import { innerHTML } from 'diffhtml';

innerHTML(document.body, `
  <h1>Hello world!</h1>
`);
```

<a name="outer-html"></a>

---

## <a href="#outer-html">outerHTML</a> **`(domNode, markup, options)`**

Replaces the contents of a DOM node with the passed in markup, only updates
what has changed. Additionally updates the attributes of the parent. If the
element you're modifying has a parent, you may also change the element type,
but this isn't really recommended.

Example:

``` js
outerHTML(document.body, '<body>Hello world</body>');
```

### Arguments

| Name        | Description
| ----------- | -----------
| **domNode** | A DOM Node to change.
| **markup**  | New markup to replace the entire `domNode` with. 
| **options** | <ul><li><strong>tasks:</strong> An array of tasks to run. Can swap these out completely to run custom logic instead.</li><li><strong>parser:</strong> Settings which influence the HTML parser, not available with the runtime build.</li></ul>


<a name="html"></a>

---

## <a href="#html">html</a> **`(markup)`**

A [tagged
template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
function that parses HTML and creates VTree's under-the-hood. Can also be used
like a normal function. Effectively creates the manual `createTree(nodeName,
attributes, children)` calls automatically by parsing the HTML. You are allowed
to "interpolate" or mix dynamic values with the HTML string content. This is
useful when working with Web Components, DOM events,

When you pass a single element and provide newlines and whitespace before and
after it, like the example below, it will be automatically trimmed. If you
provide multiple elements, the whitespace becomes 

A simple example of its usage along with interpolation.

``` js
html`
  <body>
    <center style=${{ fontSize: '11px' }}>Hello world</center>
  </body>
`;
```

Will basically convert to:

``` js
createTree('body', null, [
  createTree('center', { style: { fontSize: '11px' } }, ['Hello world']),
]);
```

To see how to run this example yourself see the [Examples](#examples) section
below.

### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="use"></a>

---

## <a href="#use">use</a> **`(middlewareFunction or middlewareObject)`**

Can be used to mount pre-existing middleware or you can write your own.
Middleware are effectively hooks that execute in various areas of the
reconciler during a render call such as `innerHTML` or `outerHTML`.

A function is useful when you want to follow the transactions (which are
started and run a series of tasks), and passing an object can be cleaner when
you want to modify the Virtual Tree or automatically add properties.

### Arguments

| Name        | Description
| ----------- | -----------
| **middlewareFunction** | Use this when you want total control over the task flow. Return inner functions to delve deeper into the flow. Any of the middleware object properties may be attached the function and used together.
| **middlewareObject** | Use this when you don't care about the transaction start/stop, and want a cleaner way to monitor the VTree lifecycle. <p><b>- createTreeHook</b></p><p><b>- syncTreeHook</b></p> <p><b>- releaseHook</b></p>

### Examples

#### Logging the start of a render transaction

``` js
function someTask(transaction) {
  console.log('Start of render transaction:', transaction);
}

use(someTask);
```

#### Logging the end of a render transaction

``` js
function someTask(transaction) {
  console.log('Start of render transaction:', transaction);

  return () => {
    console.log('End of render transaction scheduled');

    // Must wait until all transitions complete to know for sure that the
    // render action has completed.
    transaction.onceEnded(() => {
      console.log('End of render transaction completed');
    });
  };
}

use(someTask);
```

<a name="add-transition-state"></a>

---

## <a href="#add-transition-state">addTransitionState</a> **`(stateName, callback)`**

Adds global transition listeners, which trigger in reaction to when the DOM is
patched. If many elements are rendered quickly, this could be an expensive
operation, so try to limit the amount of listeners added if you're concerned
about performance.

Since the callback triggers with various elements, most of which you probably
don't care about, you'll want to filter.  A good way of filtering is to use the
DOM `matches` method.  It's fairly well supported
(http://caniuse.com/#feat=matchesselector) and may suit many projects.  If you
need backwards compatibility, consider using jQuery's `is`.

You can do fun, highly specific, filters:

``` javascript
addTransitionState('attached', element => {
  // Fade in the main container after it's attached into the DOM.
  if (element.matches('body main.container')) {
    $(element).stop(true, true).fadeIn();
  }
});
```

If you like these transitions and want to declaratively assign them in tagged
templates, check out the [diffhtml-inline-transitions
plugin](middleware.html#inline-transitions).

### Arguments

| Name        | Description
| ----------- | -----------
| **stateName** | One of the valid transition states: attached \| detached \| replaced \| attributeChanged \| textChanged
| **callback** | Triggers either an async (returns Promise) or sync function which does something when the specific DOM node has entered a transition state.

### About detached/replaced element accuracy

When rendering Nodes that contain lists of identical elements, you may not
receive the elements you expect in the detached and replaced transition state
hooks. This is a known limitation of string diffing and allows for better
performance. By default if no key is specified, the last element will be
removed and the subsequent elements from the one that was removed will be
mutated via replace.

What you should do here is add a `key` attribute with a unique `value` that
persists between renders.

For example, when the following markup...

``` html
<ul>
  <li>Test</li>
  <li>This</li>
  <li>Out</li>
</ul>
```

...is changed into...

``` html
<ul>
  <li>Test</li>
  <li>Out</li>
</ul>
```

The transformative operations are:

1. Remove the last element
2. Replace the text of the second element to 'out'

What we intended, however, was to simply remove the second item. And to achieve
that, decorate your markup like so...

``` html
<ul>
  <li key="1">Test</li>
  <li key="2">This</li>
  <li key="3">Out</li>
</ul>
```

...and update with matching attributes...

``` html
<ul>
  <li key="1">Test</li>
  <li key="3">Out</li>
</ul>
```

Now the transformative operations are:

1. Remove the second element


### Arguments

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="remove-transition-state"></a>

---

## <a href="#remove-transition-state">removeTransitionState</a> **`(stateName, callback)`**

Removes a global transition listener. When invoked with no arguments, this
method will remove all transition callbacks. When invoked with the name
argument it will remove all transition state callbacks matching the name, and
so on for the callback.

``` javascript
// Removes all registered transition states.
diff.removeTransitionState();

// Removes states by name.
diff.removeTransitionState('attached');

// Removes states by name and callback reference.
diff.removeTransitionState('attached', callbackReference);
```

### Arguments

| Name        | Description
| ----------- | -----------
| **stateName** | *Optional* Filter events to remove by a specific state
| **callback** | *Optional* Filter events to remove by the callback reference

<a name="create-tree"></a>

---

## <a href="#create-tree">createTree</a> **`(nodeName, attributes, ...childNodes)`**

Creates a Virtual Tree which can be interpolated and rendered. This has a
similar purpose to hyperscript's `h()` and React's `createElement`.

Example:

``` js
const attributes = {
  id: 'test',
  style: 'color: red',
};

const childNodes = [
  createTree('#text', null, 'Hello world'),
];

// Create a div Virtual Tree.
const div = createTree('div', attributes, childNodes);
```

### Arguments

| Name        | Description
| ----------- | -----------
| **nodeName** | A string for HTML, or if using components or middleware other types, like functions
| **attributes** | An object of DOM attributes or properties key and value or null 
| **...childNodes** | An array of child nodes, or a single element merged with any additional arguments

<a name="release"></a>

---

## <a href="#release">release</a> **`(domNode)`**

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element. Applications will
probably not use this if the app lives as long as the tab.

### Arguments

| Name        | Description
| ----------- | -----------
| **domNode** | The root DOM Node to release memory around

This method should fully release everything related to the rendering, but its
possible an untested code path is hit, so you should track the internal memory
allocations to verify that memory isn't causing a problem.

#### domNode

*Reference element.*

This argument is overloaded. Can be one of many types:

- HTML Element / DOM Node (Used interchangeably)
- Virtual Tree Element (produced from `diff.html`)

<a name="internals"></a>

---

## <a href="#internals">Internals</a>

The internals are exposed for curious developers to write code against.
Understanding these APIs will give you greater insight into how diffHTML works.

### <a name="middleware-cache" href="#middleware-cache">MiddlewareCache</a>

A JavaScript Set object that contains registered middleware functions that
trigger whenever transaction state changes.

### <a name="create-node-hook-cache" href="#create-node-hook-cache">CreateNodeHookCache</a>

A JavaScript Set object that contains functions that trigger whenever a DOM
Node is created during the patching process.

### <a name="create-tree-hook-cache" href="#create-tree-hook-cache">CreateTreeHookCache</a>

A JavaScript Set object that contains functions that trigger whenever a Virtual
Tree is created through `html`, `createTree`, or during the parsing process.

### <a name="release-hook-cache" href="#release-hook-cache">ReleaseHookCache</a>

A JavaScript Set object that contains functions that trigger whenever a Virtual
Tree is cleaned up by diffHTML's internal garbage collection. You can do
additional cleanup here.

### <a name="sync-tree-hook-cache" href="#sync-tree-hook-cache">SyncTreeHookCache</a>

A JavaScript Set object that contains functions that trigger whenever Virtual
Trees are compared.

### <a name="node-cache" href="#node-cache">NodeCache</a>

A Map that can be used to get access to the DOM Node associated to a VTree.
This is comparable to `findDOMNode` in React. Basically if you encounter an
object that the documentation says is a VTree and you want to convert to a DOM
Node, you could write something like:

```js
import { Internals } from 'diffhtml';

function findDOMNode(vTree) {
  return Internals.NodeCache.get(vTree);
}

findDOMNode(someVTree);
```

If it comes back as `null` or `undefined` then you should take that to mean
that the VTree is no longer bound to an element in the DOM. You may also find
that diffHTML has re-used the VTree you have saved, so calling `NodeCache.get`
will yield an unexpected result. Therefore its recommended to call this method
immediately if you need the DOM node and not save a VTree in between
re-renders.

### <a name="transaction" href="#transaction">Transaction</a>

A render transaction is scheduled whenever `innerHTML` or `outerHTML` are
called. It is an instance of a `Transaction` class that has a few methods:
_abort_, _end_, _onceEnded_, and _start_. This instance is mutable and the
properties will change by the internals. You should not modify the transaction
directly unless you know what you're doing. Reading any property is considered
the live source-of-truth and a safe operation.

There are a series of tasks that run when a transaction is created. Depending
on the build flavor, full or runtime, you will get a different set of tasks. By
default transactions run synchronously and you can observe a result immediately
after running `innerHTML` or `outerHTML`.

If you use `addTransitionState` and return a Promise to delay rendering, this
could cause multiple renders to stack up and then transactions will be
asynchronous.

```sh
> schedule        # If another transaction is running, this will run after
> shouldUpdate    # If nothing has changed, abort early
> parseNewTree    # Full build only, will parse a passed in string of HTML
> reconcileTrees  # Align trees before diffing
> syncTrees       # Loop through and compare trees as efficiently as possible
> patchNode       # Apply chnages to the DOM
> endAsPromise    # If a transaction is delayed, resolve once complete
```

Transactions have a number of properties available to access:

- **aborted** - The transaction was abandoned
- **completed** - The transaction successfully completed
- **domNode** - The container element being rendered into
- **endedCallbacks** - The set of callbacks that will be called once completed
- **markup** - The raw input to render
- **newTree** - The reconciled tree to use for new source-of-truth
- **oldTree** - The old tree which may already be updated with **newTree**
- **options** - Options used when renderingo
- **patches** - What has been updated in the DOM
- **promise** - The raw promise backing the tranasction completeness
- **promises** - All promises attached to the transaction from transitions
- **state** - Internal state object for the transaction
- **tasks** - Array of functions that were executed when rendering

<a name="version"></a>

---

## <a href="#version">VERSION</a>

Property which indicates the current running version of diffHTML.

### Example

``` js
console.log(VERSION);
```

---
