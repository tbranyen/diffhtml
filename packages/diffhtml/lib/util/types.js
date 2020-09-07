/**
 * @type {{ [type: string]: any }}
 */
export const EMPTY = {
  STR: '',
  NUM: 1,
  OBJ: {},
  ARR: [],
  FUNC: () => {},
  MAP: new Map(),
  SET: new Set(),
  DOM: /** @type {HTMLElement} */ ({}),
};

/**
 * @typedef {{ [type: string]: number }} PATCH_TYPE
 * @type {PATCH_TYPE}
 */
export const PATCH_TYPE = {
  'SET_ATTRIBUTE': 0,
  'REMOVE_ATTRIBUTE': 1,
  'NODE_VALUE': 2,
  'INSERT_BEFORE': 3,
  'REPLACE_CHILD': 4,
  'REMOVE_CHILD': 5,
};

/**
 * @typedef {'attached' | 'detached' | 'replaced' | 'attributeChanged' | 'textChanged'} TransitionStateName
 * @type {TransitionStateName}
 */
export const TransitionStateName = 'attached';

/**
 * @typedef {TransitionStateName[]} TransitionStateNames
 * @type {TransitionStateNames}
 */
export const TransitionStateNames = [
  'attached',
  'detached',
  'replaced',
  'attributeChanged',
  'textChanged',
];

/**
 * @typedef {Object} VTree
 *
 * @property {any} rawNodeName - unaltered extracted nodeName
 * @property {string} nodeName - lowercased, string, nodeName
 * @property {string} nodeValue - defines the text value associated
 * @property {number} nodeType - the type of Node this is representing
 * @property {string} key - A unique identifier for the children
 * @property {VTree[]} childNodes - Any nested elements
 * @property {any} attributes - Any key/val attributes for the Node
 */

/**
 * @type {VTree}
 */
export const VTree = {
  rawNodeName: EMPTY.STR,
  nodeName: EMPTY.STR,
  nodeValue: EMPTY.STR,
  nodeType: EMPTY.NUM,
  key: EMPTY.STR,
  childNodes: EMPTY.ARR,
  attributes: EMPTY.OBJ,
};

/**
 * @typedef {Object} VTreeLike

 * @property {any=} rawNodeName - unaltered extracted nodeName
 * @property {string} nodeName - lowercased, string, nodeName, only required value
 * @property {string=} elementName - lowercased, string, elementName
 * @property {string=} nodeValue - defines the text value associated
 * @property {number=} nodeType - the type of Node this is representing
 * @property {string=} key - A unique identifier for the children
 * @property {VTreeLike[]=} childNodes - Any nested elements
 * @property {VTreeLike[]=} children - Any nested elements
 * @property {any=} attributes - Any key/val attributes for the Node */

/**
 * @type {VTreeLike}
 */
export const VTreeLike = {
  nodeName: EMPTY.STR,
};

/**
 * @typedef {HTMLElement | Text | Comment | DocumentFragment | Function | string | string[] | VTree | VTree[] | VTreeLike | VTreeLike[]} ValidInput
 * @type {ValidInput}
 */
export const ValidInput = EMPTY.STR;

/**
 * @typedef {Element | HTMLElement | Text | DocumentFragment | ChildNode} ValidNode
 * @type {ValidNode}
 */
export const ValidNode = EMPTY.DOM;

/**
 * @typedef {ValidNode | VTree | VTree[] | VTreeLike | VTreeLike[]} Mount
 * @type {Mount}
 */
export const Mount = EMPTY.STR;

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
 * @type {Middleware}
 */
export const Middleware = {};

/**
 * @typedef {Object} ParserOptions
 *
 * @property {Boolean=} strict - Should the parser operate in strict mode
 * @property {Boolean=} trim - Trim surrounding whitespace nodes
 * @property {string[]=} rawElements - Set of raw tagNames, empty is all
 * @property {string[]=} selfClosingElements - Set of self closing element tagNames, empty is all
 */

/**
 * @type {ParserOptions}
 */
export const ParserOptions = {};

 /**
 * @typedef {Object} Options
 *
 * @property {Boolean=} inner - to diff children or root
 * @property {Boolean=} executeScripts - to execute scripts or not
 * @property {Function[]=} tasks - to override tasks
 * @property {ParserOptions=} parser - override parser options
 */

/**
 * @type {Options}
 */
export const Options = {};

/**
 * @typedef {Object} Supplemental
 *
 * @property {{ [key: string]: any }} tags
 * @property {{ [key: string]: any }} attributes
 * @property {{ [key: string]: any }} children
 */

/**
 * @type {Supplemental}
 */
export const Supplemental = {
  attributes: EMPTY.OBJ,
  tags: EMPTY.OBJ,
  children: EMPTY.OBJ,
};

/**
 * @typedef {Object} TransactionState
 *
 * @property {Function} measure
 * @property {Set<VTree>} svgElements
 * @property {Map<VTree, string | undefined>} scriptsToExecute
 * @property {ValidInput=} markup
 * @property {VTree=} oldTree
 * @property {Boolean=} isRendering
 * @property {String=} previousMarkup
 * @property {any=} activeTransaction
 * @property {any=} nextTransaction
 * @property {Document=} ownerDocument
*/

/**
 * @type {TransactionState}
 */
export const TransactionState = {
  measure: EMPTY.FUNC,
  svgElements: EMPTY.SET,
  scriptsToExecute: EMPTY.MAP,
};

/**
 * Associates active transaction mount with state.
 *
 * @typedef {Map<Mount, TransactionState>} StateCache
 * @type {StateCache}
 */
export const StateCache = new Map();

/**
 * Associates a VTree with a distinctive DOM Node.
 *
 * @typedef {Map<VTree, ValidNode>} NodeCache
 */
/**
 * @type {NodeCache} implements NodeCache
 */
export const NodeCache = new Map();

/**
 * Creates a mapping of TransitionState
 *
 * @typedef {Map<TransitionStateName, Set<Function>>} TransitionCache
 * @type {TransitionCache}
 */
export const TransitionCache = new Map([
  ['attached', new Set()],
  ['detached', new Set()],
  ['replaced', new Set()],
  ['attributeChanged', new Set()],
  ['textChanged', new Set()],
]);

/**
 * Stores middleware functions/objects which hook into the render flow.
 *
 * @typedef {Set<Function>} MiddlewareCache
 * @type {MiddlewareCache}
 */
export const MiddlewareCache = new Set();

/**
 * @typedef {Set<Function>} CreateTreeHookCache
 * @type {CreateTreeHookCache}
 */
export const CreateTreeHookCache = new Set();

/**
 * @typedef {(vTree: VTree) => ValidNode | void} CreateNodeHookCallback
 * @typedef {Set<CreateNodeHookCallback>} CreateNodeHookCache
 * @type {CreateNodeHookCache}
 */
export const CreateNodeHookCache = new Set();

/**
 * @typedef {Set<Function>} SyncTreeHookCache
 * @type {SyncTreeHookCache}
 */
export const SyncTreeHookCache = new Set();

/**
 * @typedef {Set<Function>} ReleaseHookCache
 * @type {ReleaseHookCache}
 */
export const ReleaseHookCache = new Set();

/**
 * @typedef {Set<Function>} ParseHookCache
 * @type {ParseHookCache}
 */
export const ParseHookCache = new Set();

/**
 * @typedef {Object} Internals
 *
 * @property {string=} VERSION
 * @property {Function} decodeEntities
 * @property {Function} escape
 * @property {Function} makeMeasure
 * @property {object} memory
 * @property {object} Pool
 * @property {object} process
 * @property {PATCH_TYPE} PATCH_TYPE
 * @property {Function=} parse
 * @property {Function} createNode
 * @property {Function} syncTree
 * @property {Function} Transaction
 * @property {object} defaultTasks
 * @property {object} tasks
 * @property {StateCache} StateCache
 * @property {NodeCache} NodeCache
 * @property {TransitionCache} TransitionCache
 * @property {MiddlewareCache} MiddlewareCache
 * @property {CreateTreeHookCache} CreateTreeHookCache
 * @property {CreateNodeHookCache} CreateNodeHookCache
 * @property {SyncTreeHookCache} SyncTreeHookCache
 * @property {ReleaseHookCache} ReleaseHookCache
 * @property {ParseHookCache} ParseHookCache
 */

/**
 * @type {Internals}
 */
export const Internals = {
  decodeEntities: EMPTY.FUNC,
  escape: EMPTY.FUNC,
  makeMeasure: EMPTY.FUNC,
  memory: EMPTY.OBJ,
  Pool: EMPTY.OBJ,
  process: EMPTY.OBJ,
  PATCH_TYPE: EMPTY.OBJ,
  parse: EMPTY.FUNC,
  createNode: EMPTY.FUNC,
  syncTree: EMPTY.FUNC,
  Transaction: EMPTY.FUNC,
  defaultTasks: EMPTY.OBJ,
  tasks: EMPTY.OBJ,
  StateCache: EMPTY.MAP,
  NodeCache: EMPTY.MAP,
  TransitionCache: EMPTY.MAP,
  MiddlewareCache: EMPTY.SET,
  CreateNodeHookCache: EMPTY.SET,
  CreateTreeHookCache: EMPTY.SET,
  SyncTreeHookCache: EMPTY.SET,
  ReleaseHookCache: EMPTY.SET,
  ParseHookCache: EMPTY.SET,
};