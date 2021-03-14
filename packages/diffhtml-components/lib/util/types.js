/**
 * @type {{ [type: string]: any }}
 */
export const EMPTY = {
  OBJ: {},
  BOOL: true,
};

export const ComponentTreeCache = new Map();

/**
 * @typedef {Map<VTree, any[]>} InstanceCache
 * @type {InstanceCache}
 */
export const InstanceCache = new Map();

/**
 * @typedef {Function} RenderFunction
 *
 * @property {Props} props
 * @property {State} state
 *
 * @returns {VTree[] | VTree | null | undefined}
 */
export const RenderFunction = EMPTY.OBJ;

/** @typedef {{ [key: string]: any }} Props */
export const Props = EMPTY.OBJ;

/** @typedef {{ [key: string]: any }} Context */
export const Context = EMPTY.OBJ;

/** @typedef {{ [key: string]: any }} State */
export const State = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/util/types').ValidNode & { shadowRoot: any }} ValidNode */
export const ValidNode = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/util/types').VTree} VTree */
export const VTree = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/transaction').default} Transaction */
export const Transaction = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/index')} DIFF_BINDING */
export const DIFF_BINDING = EMPTY.OBJ;