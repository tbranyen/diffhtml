- `Element.PRESERVE\_DIFF\_WHITESPACE = true`
  - Will allow developers to instruct the diff to preserve the whitespace text
    nodes.  This will have an impact on performance, but will support more HTML
    documents than if disabled.

- `document.DISABLE_WORKER = true`
  - Disables the worker from processing

- Transition elements callback, signature (old, new)
  - Always inserts new element into dom.  In the case of replace, it is
    inserted immediatel adjacent to the old node.
  - Return a promise to delay until transition is complete.

  - States:
    - Add element: (null, new)
    - Replace element: (old, new);
    - Remove element: (old, null)
