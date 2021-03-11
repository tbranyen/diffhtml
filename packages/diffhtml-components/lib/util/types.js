import Component from '../component';

export const ComponentTreeCache = new Map();

/**
 * @typedef {Map<VTree, Component[]>} InstanceCache
 * @type {InstanceCache}
 */
export const InstanceCache = new Map();

/**
 * @type {{ [type: string]: any }}
 */
export const EMPTY = {
  OBJ: {},
};

/**
 * @typedef {{ [key: string]: any }} Props
 */
export const Props = EMPTY.OBJ;

/**
 * @typedef {{ [key: string]: any }} Context
 */
export const Context = EMPTY.OBJ;

/**
 * @typedef {{ [key: string]: any }} State
 */
export const State = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/util/types').ValidNode} ValidNode */
export const ValidNode = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/util/types').VTree} VTree */
export const VTree = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/transaction').default} Transaction */
export const Transaction = EMPTY.OBJ;

/** @typedef {import('diffhtml')} DIFF_BINDING */
export const DIFF_BINDING = EMPTY.OBJ;