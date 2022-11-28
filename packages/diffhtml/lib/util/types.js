/**
 * @enum {number}
 */
export const NODE_TYPE = {
  ELEMENT: 1,
  ATTR: 2,
  TEXT: 3,
  COMMENT: 8,
  FRAGMENT: 11,
};

/**
 * @enum {any}
 */
export const EMPTY = {
  STR: '',
  NUM: 1,
  OBJ: /** @type {any} */ ({}),
  ARR: [],
  MAP: new Map(),
  SET: new Set(),
  DOM: /** @type {HTMLElement} */ ({}),
  FUN: () => {},
};

/**
 * @enum {number}
 */
export const PATCH_TYPE = {
  SET_ATTRIBUTE: 0,
  REMOVE_ATTRIBUTE: 1,
  NODE_VALUE: 2,
  INSERT_BEFORE: 3,
  REPLACE_CHILD: 4,
  REMOVE_CHILD: 5,
};

/**
 * Associates active transaction mount with state.
 *
 * @typedef {Map<Mount, TransactionState>} StateCache
 */
export const StateCache = new Map();

/**
 * Associates a VTree with a distinctive DOM Node.
 *
 * @typedef {Map<VTree, ValidNode>} NodeCache
 */
export const NodeCache = new Map();

/**
 * Stores middleware functions/objects which hook into the render flow.
 *
 * @typedef {Set<Function>} MiddlewareCache
 */
export const MiddlewareCache = new Set();

/**
 * @typedef {Set<Function>} CreateTreeHookCache
 */
export const CreateTreeHookCache = new Set();

/**
 * @typedef {(vTree: VTree) => ValidNode | void} CreateNodeHookCallback
 * @typedef {Set<CreateNodeHookCallback>} CreateNodeHookCache
 */
export const CreateNodeHookCache = new Set();

/**
 * @typedef {Set<Function>} SyncTreeHookCache
 */
export const SyncTreeHookCache = new Set();

/**
 * @typedef {Set<Function>} ReleaseHookCache
 */
export const ReleaseHookCache = new Set();

/**
 * @typedef {Set<Function>} ParseHookCache
 */
export const ParseHookCache = new Set();

/**
 * @typedef {{ [key: string]: any }} VTreeAttributes
 *
 */
export const VTreeAttributes = EMPTY.OBJ;

/**
 * @typedef {Object} VTree
 *
 * @property {any} rawNodeName - unaltered extracted nodeName
 * @property {string} nodeName - lowercased, string, nodeName
 * @property {string} nodeValue - defines the text value associated
 * @property {number} nodeType - the type of Node this is representing
 * @property {string} key - A unique identifier for the children
 * @property {VTree[]} childNodes - Any nested elements
 * @property {VTreeAttributes} attributes - Any key/val attributes for the Node
 */

/**
 * @typedef {Object} VTreeLike

 * @property {any=} rawNodeName - unaltered extracted nodeName
 * @property {string=} nodeName - lowercased, string, nodeName, only required value
 * @property {string=} elementName - lowercased, string, elementName
 * @property {string=} nodeValue - defines the text value associated
 * @property {number=} nodeType - the type of Node this is representing
 * @property {string=} key - A unique identifier for the children
 * @property {VTreeLike[]=} childNodes - Any nested elements
 * @property {VTreeLike[]=} children - Any nested elements
 * @property {any=} attributes - Any key/val attributes for the Node
 */

/**
 * @typedef {HTMLElement | ChildNode | Element | Text | Comment | DocumentFragment | Function | string | string[] | VTree | VTree[] | VTreeLike | VTreeLike[]} ValidInput
 */

/**
 * @typedef {Element | HTMLElement | Text | DocumentFragment | ChildNode} ValidNode
 */

/**
 * @typedef {ValidNode | VTree | VTree[] | VTreeLike | VTreeLike[]} Mount
 */

/**
 * @typedef {Object} Middleware
 *
 * @property {string=} displayName
 * @property {Function=} subscribe
 * @property {Function=} unsubscribe
 * @property {Function=} createTreeHook
 * @property {CreateNodeHookCallback=} createNodeHook
 * @property {Function=} syncTreeHook
 * @property {Function=} releaseHook
 * @property {Function=} parseHook
 */

/**
 * @typedef {Object} ParserConfig
 *
 * @property {string[]=} rawElements - Set of raw element tagNames, empty is all
 * @property {string[]=} selfClosingElements - Set of self closing element tagNames, empty is all
 */

/**
 * @typedef {Object} TransactionConfig
 *
 * @property {Boolean=} inner - to diff children or root
 * @property {Boolean=} executeScripts - to execute scripts or not
 * @property {Function[]=} tasks - to override tasks
 * @property {ParserConfig=} parser - override parser options
 * @property {Boolean=} disableMutationObserver - to disable mutation observer (enabled by default if available)
 */

/**
 * @typedef {Object} GlobalConfig
 *
 * @property {string=} NODE_ENV - To set the runtime execution mode
 * @property {Boolean=} collectMetrics - to collect performance metrics, defaults to false
 */

/**
 * @typedef {TransactionConfig & GlobalConfig & { [key: string]: unknown }} Config
 */

/**
 * @typedef {Object} Supplemental
 *
 * @property {{ [key: string]: any }} tags
 * @property {{ [key: string]: any }} attributes
 * @property {{ [key: string]: any }} children
 */

/**
 * @typedef {Object} TransactionState
 *
 * @property {Function} measure
 * @property {Set<VTree>} svgElements
 * @property {Map<VTree, string | undefined>} scriptsToExecute
 * @property {VTree=} oldTree
 * @property {Boolean=} isRendering
 * @property {Boolean=} isDirty
 * @property {MutationObserver=} mutationObserver
 * @property {Document=} ownerDocument
*/

/**
 * @typedef {Object} Internals
 *
 * @property {string=} VERSION
 * @property {GlobalConfig=} globalConfig
 * @property {Function} decodeEntities
 * @property {Function} escape
 * @property {Function} makeMeasure
 * @property {any} memory
 * @property {any} Pool
 * @property {any} process
 * @property {{ [key: string]: any }} PATCH_TYPE
 * @property {Function} parse
 * @property {Function} createNode
 * @property {Function} syncTree
 * @property {unknown} Transaction
 * @property {Function[]} defaultTasks
 * @property {{ [key: string]: any }} tasks
 * @property {StateCache} StateCache
 * @property {NodeCache} NodeCache
 * @property {MiddlewareCache} MiddlewareCache
 * @property {CreateTreeHookCache} CreateTreeHookCache
 * @property {CreateNodeHookCache} CreateNodeHookCache
 * @property {SyncTreeHookCache} SyncTreeHookCache
 * @property {ReleaseHookCache} ReleaseHookCache
 * @property {ParseHookCache} ParseHookCache
 */
