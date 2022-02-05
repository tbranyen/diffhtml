# Core API

This documentation covers the core public API. All methods and internals work
in the browser and directly in [Node.js](https://nodejs.org/en/) with or without
[jsdom](https://github.com/jsdom/jsdom).

**Terminology:**

- **VTree**: You will see them mentioned throughout the documentation. They are
  JavaScript objects that represent a DOM node. They store information such as
  the tagName, what the childNodes are, and more. A reference to a VTree can get
  you access to the DOM node it represents. They are used throughout the
  codebase to simplify and abstract the internals away from the DOM, in favor of
  one that is virtual, hence the V.

  An added bonus to this is that diffHTML can work seamlessly in Node.js without
  a DOM abstraction such as jsdom.

- **Transaction**: An object that represents a render. One is produced every
  time you call innerHTML, outerHTML, or toString. You don't need to worry about
  it unless you're trying to deeply understand the library.

<a name="inner-html"></a>

---

## <a href="#inner-html">innerHTML</a> **`(mount, input, options)`**

Compares and updates the contents of `mount` with the `input`. Creates a
Transaction, invokes [middleware](/middleware.html), compares old and new markup, runs [transitions](/transitions.html), and patches the DOM.

<a name="inner-html-arguments"></a>

### <a href="#inner-html-arguments"><u>Arguments</u></a>

| Name        | Description
| ----------- | -----------
| **mount**   | DOM Node or VTree to sync or patch the **childNodes** of.
| **input**   | New markup to replace into **mount**.
| **options** | **[Config options](#options)**, `inner` is always `true`

<a name="inner-html-examples"></a>

### <a href="#inner-html-examples"><u>Examples</u></a>

``` js
import { innerHTML } from 'diffhtml';

innerHTML(document.body, `
  <h1>Hello world!</h1>
`);
```

<a name="outer-html"></a>

---

## <a href="#outer-html">outerHTML</a> **`(mount, input, options)`**

Same as [`innerHTML`](#inner-html) except compares the `input` directly to the
`mount`, instead of the `childNodes`.

Replaces the contents of a DOM node with the passed in markup, only updates
what has changed. Additionally updates the attributes of the parent. If the
element you're modifying has a parent, you may also change the element type,
but this can sometimes result in unexpected behavior.

<a name="outer-html-arguments"></a>

### <a href="#outer-html-arguments"><u>Arguments</u></a>

| Name        | Description
| ----------- | -----------
| **mount**   | DOM Node or VTree to sync or patch.
| **input**   | New markup to replace into **mount**.
| **options** | **[Config options](#options)**, `inner` is always `false`

<a name="outer-html-examples"></a>

### <a href="#outer-html-examples"><u>Examples</u></a>

``` js
import { outerHTML } from 'diffhtml';

outerHTML(document.body, `
  <body>Hello world</body>
`);
```


<a name="to-string"></a>

---

## <a href="#to-string">toString</a> **`(input, options)`**

Takes any valid input and returns a serialized string of XML/HTML markup. This
helps you create static markup from complex renders to a simple `VTree`.

All middleware run during this, so features like components and logging work.

<a name="to-string-arguments"></a>

### <a href="#to-string-arguments"><u>Arguments</u></a>

| Name        | Description
| ----------- | -----------
| **input**   | New markup to replace into **mount**.
| **options** | **[Config options](#options)**, `inner` and `executeScripts` have no effect

<a name="to-string-examples"></a>

### <a href="#to-string-examples"><u>Examples</u></a>

``` js
import { toString } from 'diffhtml';

toString('<body>Hello world</body>');
// <body>Hello world</body>
```

<a name="html"></a>

---

## <a href="#html">html</a> **`(markup)`**

A [tagged
template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
function that [parses string markup](/parser.html) and creates VTree
under-the-hood. Can also be used like a normal function, where you pass markup
as the first argument, and values as `param2`, `param3`, `...`. You are able to
"interpolate" or mix dynamic values with the HTML string content. This is
useful when passing event handlers, objects to DOM elements, passing properties
to components, and more.

When you pass a single element and provide newlines and whitespace before and
after it, like the examples below, they will be automatically trimmed out of
the final tree. If you provide multiple elements, the whitespace will become
part of the tree.

<a name="html-arguments"></a>

### <a href="#html-arguments"><u>Arguments</u></a>

The two required inputs are a reference element and new element to compare.
Although "element" is used, the actual input can be of various input types
all representing an element (or many elements).

<a name="html-examples"></a>

### <a href="#html-examples"><u>Examples</u></a>

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

<a name="use"></a>

---

## <a href="#use">use</a> **`(middlewareFunction or middlewareObject)`**

This function is used to hook plugins into your render pipeline. These plugins
are referred to as middleware. They are meant for advanced use cases such as
observing the render flow, modifying attributes or elements, and more.

Middleware can be enabled and disabled via code or the browser DevTools.

[**Refer to the Middleware documentation for documentation on writing your own
and find existing plugins.**](/middleware.html)

<a name="use-arguments"></a>

### <a href="#use-arguments"><u>Arguments</u></a>

| Name        | Description
| ----------- | -----------
| **middlewareFunction** | Use this when you want total control over the task flow. Return inner functions to delve deeper into the flow. Any of the middleware object properties may be attached the function and used together.
| **middlewareObject** | Use this when you don't care about the transaction start/stop, and want a cleaner way to monitor the VTree lifecycle. <ul><li>displayName</li><li>createNodeHook</li><li>createTreeHook</li><li>syncTreeHook</li><li>releaseHook</li><li>subscribe</li><li>unsubscribe</li></ul>

<a name="use-examples"></a>

### <a href="#use-examples"><u>Examples</u></a>

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

<a name="add-transition-state-arguments"></a>

### <a href="#add-transition-state-arguments"><u>Arguments</u></a>

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

<a name="remove-transition-state"></a>

---

## <a href="#remove-transition-state">removeTransitionState</a> **`(stateName, callback)`**

Removes a global transition listener. When invoked with no arguments, this
method will remove all transition callbacks. When invoked with the name
argument it will remove all transition state callbacks matching the name, and
so on for the callback.


<a name="remove-transition-state-arguments"></a>

### <a href="#remove-transition-state-arguments"><u>Arguments</u></a>

| Name        | Description
| ----------- | -----------
| **stateName** | *Optional* Filter events to remove by a specific state
| **callback** | *Optional* Filter events to remove by the callback reference

<a name="remove-transition-examples"></a>

### <a href="#remove-transition-examples"><u>Examples</u></a>

``` javascript
// Removes all registered transition states.
diff.removeTransitionState();

// Removes states by name.
diff.removeTransitionState('attached');

// Removes states by name and callback reference.
diff.removeTransitionState('attached', callbackReference);
```

<a name="create-tree"></a>

---

## <a href="#create-tree">createTree</a> **`(nodeName, attributes, ...childNodes)`**

Creates a Virtual Tree (VTree) which can be interpolated and rendered. This has
a similar purpose to hyperscript's `h()` and React's `createElement`.

<a name="create-tree-arguments"></a>

### <a href="#create-tree-arguments"><u>Arguments</u></a>

| Name              | Description
| ----------------- | -----------
| **nodeName**      | A string for HTML, or couuld be a component or other types like functions when using middleware
| **attributes**    | An object of DOM attributes or properties key and value or null
| **...childNodes** | An array of child nodes, or a single element merged with any additional arguments

<a name="create-tree-examples"></a>

### <a href="#create-tree-examples"><u>Examples</u></a>

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

<a name="release"></a>

---

## <a href="#release">release</a> **`(mount)`**

Use this method if you need to clean up memory allocations and anything else
internal to diffHTML associated with your element. This is very useful for unit
testing and general cleanup when you're done with an element. Applications will
probably not use this if the app lives as long as the tab.

<a name="release-arguments"></a>

### <a href="#release-arguments"><u>Arguments</u></a>

| Name        | Description
| ----------- | -----------
| **mount**   | Release memory and all internal references to the DOM node.

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

<a name="version" />

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

Allows configuring runtime rendering behavior. These options are accessible via
`transaction.config` and can be set via query string, environment variables, or
passing a config object to `innerHTML`, `outerHTML`, and `toString`.

In the case of query string and environment variables, uppercase the variables
and prefix with `DIFF_`. So `inner` becomes `DIFF_INNER`. For `parser` use a
JSON string: `JSON.stringify({ parser: { strict: true } })`.

- [`inner`](#options-inner)
- [`tasks`](#options-tasks)
- [`executeScripts`](#options-execute-scripts)
- [`parser`](#options-parser)

<a name="options-inner" />

---

### <a href="#options-inner">inner `Boolean`</a>

Determines if the Transaction should update the DOM Node or just its children.
Setting this to `true` will emulate the behavior of `innerHTML` and setting it
to `false` emulates `outerHTML`. You cannot set this using `innerHTML` or
`outerHTML`, and it has no effect with `toString` so it is only useful if you
manually create Transactions which is an advanced use case.

<a name="options-tasks" />

### <a href="#options-tasks">tasks `Function[]`</a>

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

<a name="options-execute-scripts" />

### <a href="#options-execute-scripts">executeScripts `Boolean`</a>

Control whether or not newly appended scripts are executed or not. When
enabled, tricks the browser by setting the `type` property to `no-execute` when
a script is added. This prevents the browser from executing the script.

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

<a name="options-parser" />

### <a href="#options-parser">parser `Object`</a>

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

---
