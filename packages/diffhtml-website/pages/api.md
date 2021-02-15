# <a href="/api.html">Core API</a> <a class="github" href="https://github.com/tbranyen/diffhtml/tree/master/packages/diffhtml"><i class="fa fa-github"></i></a>

This documentation covers the core public API and is central to the framework.
All methods work in the browser, with JSDOM, and directly in Node. You use this
to construct the Virtual DOM, synchronize changes, and patch the DOM.

``` sh
npm install diffhtml
```

Some lingo to be aware of:

- **Transaction**: A class structure which represents a set of changes to the
  DOM.
- **VTree**: Virtual Tree, represents the shape of a DOM node, Component,
  etc. These objects are created when diffHTML first loads and help regulate
  memory usage.
- **Mount**: Most commonly a DOM node that you want to update, but can also be
  VTrees and other types.

<a name="inner-html"></a>

---

## <a href="#inner-html">innerHTML</a> **`(mount, input, options)`**

Compares the children of mount with input.

The `innerHTML` and `outerHTML` methods are the most common to use. They allow
you to mimic the respective browser feature, where you replace the contents of
a DOM node and in the case of `outerHTML` replace the top-level element
attributes as well.  You may call this once in a complex application where the
individual components re-render themselves, or in a game you would call this on
every render tick, if you're building something simple, you can call it
whenever the state changes.

These methods can work in the browser and browser-like environments like JSDOM.
An interesting feature is that you can pass in more than just DOM nodes. This
comes in handy for advanced use cases such as

What's nice about these methods is that all renders go through the same
scheduling pipeline and VTrees are shared across all other renders.

### Arguments

| Name        | Description
| ----------- | -----------
| **mount**   | The root DOM node to update children in, but not the node itself.
| **input**   | New markup to replace into **mount**.
| **options** | <ul><li><strong>tasks:</strong> An array of tasks to run. Can swap these out to modify the render flow.</li><li><strong>parser:</strong> Settings which influence the HTML parser.</li></ul>

### Examples

``` js
import { innerHTML } from 'diffhtml';

innerHTML(document.body, `
  <h1>Hello world!</h1>
`);
```

<a name="outer-html"></a>

---

## <a href="#outer-html">outerHTML</a> **`(mount, input, options)`**

Compares the attributes and children of mount with input.

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
| **mount**   | The root DOM node to update including attributes and children.
| **input**   | New markup to replace into **mount**.
| **options** | <ul><li><strong>tasks:</strong> An array of tasks to run. Can swap these out to modify the render flow.</li><li><strong>parser:</strong> Settings which influence the HTML parser.</li></ul>

<a name="to-string"></a>

---

## <a href="#to-string">toString</a> **`(input, options)`**

Takes any valid input and returns a serialized string of XML/HTML markup.

Example:

``` js
toString('<body>Hello world</body>');
// <body>Hello world</body>
```

### Arguments

| Name        | Description
| ----------- | -----------
| **input**   | New markup to replace into **mount**.
| **options** | <ul><li><strong>tasks:</strong> An array of tasks to run. Can swap these out to modify the render flow.</li><li><strong>parser:</strong> Settings which influence the HTML parser.</li></ul>

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
const vTree = html`
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

This function is used to hook plugins into your render pipeline. These plugins
are referred to as middleware. They are meant for advanced use cases such as
observing the render flow, modifying attributes or elements, and more.

Middleware can be enabled and disabled via code or the browser DevTools.

[**Refer to the Middleware documentation for documentation on writing your own
and find existing plugins.**](/middleware.html)

### Arguments

| Name        | Description
| ----------- | -----------
| **middlewareFunction** | Use this when you want total control over the task flow. Return inner functions to delve deeper into the flow. Any of the middleware object properties may be attached the function and used together.
| **middlewareObject** | Use this when you don't care about the transaction start/stop, and want a cleaner way to monitor the VTree lifecycle. <ul><li>displayName</li><li>createNodeHook</li><li>createTreeHook</li><li>syncTreeHook</li><li>releaseHook</li><li>subscribe</li><li>unsubscribe</li></ul>

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

Creates a Virtual Tree (VTree) which can be interpolated and rendered. This has
a similar purpose to hyperscript's `h()` and React's `createElement`.

Examples:

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

| Name              | Description
| ----------------- | -----------
| **nodeName**      | A string for HTML, or couuld be a component or other types like functions when using middleware
| **attributes**    | An object of DOM attributes or properties key and value or null
| **...childNodes** | An array of child nodes, or a single element merged with any additional arguments

<a name="release"></a>

---

## <a href="#release">release</a> **`(mount)`**

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element. Applications will
probably not use this if the app lives as long as the tab.

### Arguments

| Name        | Description
| ----------- | -----------
| **mount**   | Release memory and all internal references to the DOM node.

#### domNode

*Reference element.*

This argument is overloaded. Can be one of many types:

- HTML Element / DOM node (Used interchangeably)
- Virtual Tree Element (produced from `diff.html`)

<a name="internals"></a>

---

## <a href="#internals">Internals</a>

These internals are deemed public API and may be relied upon once the library
has reached a stable version. The intention is to allow developers to tweak
the library, observe and influence internal memory, and build tooling around
the runtime.

### <a name="middleware-cache" href="#middleware-cache">MiddlewareCache</a>

A JavaScript Set object that contains registered middleware functions that
trigger whenever transaction state changes. Use this to help enable/disable
middleware functions from running during renders.

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
Trees are compared. You can influence how the Virtual DOM synchronizes changes,
by changing attributes JIT, telling diffHTML to ignore certain nodes, or tell
diffHTML to not apply any changes to a given node.

### <a name="node-cache" href="#node-cache">NodeCache</a>

A Map that can be used to get access to the DOM node associated to a VTree.
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
- **input** - The raw input to render
- **newTree** - The reconciled tree to use for new source-of-truth
- **oldTree** - The old tree which may already be updated with **newTree**
- **options** - Options used when updating markup
- **patches** - What has been updated in the DOM
- **promise** - The raw promise backing the tranasction completeness
- **promises** - All promises attached to the transaction from transitions
- **state** - Internal state object for the transaction
- **tasks** - Array of functions that were executed when rendering

### <a name="internals-version" href="#internals-version">VERSION</a>

See [VERSION](#version)

<a name="version"></a>

---

## <a href="#version">VERSION</a>

Property which indicates the current running version of diffHTML.

### Example

``` js
console.log(VERSION);
```

<a name="options"></a>

---

## <a href="#options">Options</a>

- [`tasks`](#tasks)
- [`executeScripts`](#execute-scripts)
- [`parser`](#parser)

<!--
### inner `Boolean`

Determines if the Transaction should update the DOM Node or just its children.
Setting this to `true` will emulate the behavior of `innerHTML` and setting it
to `false` emulates `outerHTML`.
-->

### tasks `Function[]`

Manipulate the tasks which run. This can allow you to do interesting things
with the core API. You can do API changes like providing a stream or generator
API for the return signature, you can remove syncing and provide your own
object for patching, etc. This feature is used by the project to create the
toString method, which changes the return value to a string.

_Caution: Only modify this in a closed environment and
do not ship components or shared utils which attempt to modify the host tasks._

#### Example

Change the return value of innerHTML to be a callback.

```js
import { innerHTML, Internals } from 'diffhtml';

// Start with the default tasks.
const newTasks = new Set(Internals.defaultTasks);

newTasks.delete(Internals.tasks.endAsPromise);

// Update the transaction end by returning a callback instead of using a
// Promise based API.
newTasks.add(transaction => {
  const { promises } = transaction;

  // Change the final return value to a callback.
  return callback => {
    if (promises && promises.length) {
      return transaction.promise = Promise.all(promises).then(() => {
        transaction.end();
        callback(transaction);
      });
    }

    transaction.promise = Promise.resolve(transaction.end());
    callback(transaction);
  };
});

// You can supress this behavior by setting executeScripts to false
innerHTML(document.body, `<h1>Hello world</h1>`, {
  tasks: [...newTasks],
})(transaction => {
  console.log('Render has completed with transaction', transaction);
});
```

### executeScripts `Boolean`

Control whether or not newly appended scripts are executed or not. Tricks the
browser by setting the `type` property to `no-execute` when a script is added.
This prevents the browser from executing the script.

#### Example

```js
import { innerHTML } from 'diffhtml';

// By default scripts will execute
innerHTML(document.body, `<script>window.alert('here')</script>`);

// You can supress this behavior by setting executeScripts to false
innerHTML(document.body, `<script>window.alert('here')</script>`, {
  executeScripts: false,
});

```

### parser `Object`

These options modify the parser by making it more strict or changing which
elements are treated as block or self closing.

[Learn more about these options](/parser.html#options)

#### Example

This example will throw an error since the parser encountered invalid markup.

```js
import { innerHTML } from 'diffhtml';

innerHTML(document.body, `
  <h1>Hello world</h2>
`, { parser: { strict: true } });
```
