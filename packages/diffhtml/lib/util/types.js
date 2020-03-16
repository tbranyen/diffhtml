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
 * @property {Partial<VTree>[]} childNodes - Any nested elements
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
 * @typedef {Object} Middleware - defines Middleware
 *
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