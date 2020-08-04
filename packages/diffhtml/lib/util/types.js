/**
 * @enum {number}
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
 * @typedef {Object} VTree - defines VTree type
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
 * @type {VTree} implements VTree
 */
export const VTree = {
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: {},
};

/**
 * @typedef {Object} VTreeLike - defines a valid or loosely shaped VTree

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
 * @type {VTreeLike} implements VTreeLike
 */
export const VTreeLike = {
  nodeName: '',
};

/**
 * @typedef {HTMLElement | Text | Comment | DocumentFragment | Function | string | string[] | VTree | VTree[] | VTreeLike | VTreeLike[]} ValidInput
 */

/**
 * @type {ValidInput}
 */
export const ValidInput = '';

/**
 * @typedef {HTMLElement | Text | DocumentFragment | unknown} ValidNode
 */

/**
 * @type {ValidNode}
 */
export const ValidNode = null;

/**
 * @typedef {HTMLElement | DocumentFragment | string | VTree | VTree[] | VTreeLike | VTreeLike[]} Mount
 */

/**
 * @type {Mount}
 */
export const Mount = '';

/**
 * @typedef {Object} Middleware - defines Middleware
 *
 * @property {string=} displayName
 * @property {Function=} subscribe
 * @property {Function=} unsubscribe
 * @property {Function=} createTreeHook
 * @property {Function=} createNodeHook
 * @property {Function=} syncTreeHook
 * @property {Function=} releaseHook
 */

/**
 * @type {Middleware} implements Middleware
 */
export const Middleware = {};

/**
 * @typedef {Object} ParserOptions - defines ParserOptions type
 *
 * @property {Boolean=} strict - Should the parser operate in strict mode
 * @property {string[]=} rawElements - Set of raw tagNames, empty is all
 * @property {string[]=} selfClosingElements - Set of self closing element tagNames, empty is all
 */

/**
 * @type {ParserOptions} implements ParserOptions
 */
export const ParserOptions = {};

 /**
 * @typedef {Object} Options - defines Options type
 *
 * @property {Boolean=} inner - to diff children or root
 * @property {Boolean=} executeScripts - to execute scripts or not
 * @property {Function[]=} tasks - to override tasks
 * @property {ParserOptions=} parser - override parser options
 */

/**
 * @type {Options} implements VTree
 */
export const Options = {};

/**
 * @typedef {Object} Supplemental - defines Supplemental
 *
 * @property {{ [key: string]: any }} tags
 * @property {{ [key: string]: any }} attributes
 * @property {{ [key: string]: any }} children
 */

/**
 * @type {Supplemental} implements Supplemental
 */
export const Supplemental = {
  attributes: {},
  tags: {},
  children: {},
};
