/**
 * Finds a more specific type identifier.
 * 
 * @param {any} x 
 * @returns {string}
 */
export const type = x => toString.call(x).split(' ')[1].slice(0, -1).toLowerCase();

/**
 * @type {{ [type: string]: any }}
 */
export const EMPTY = {
  OBJ: {},
};

/** @typedef {import('diffhtml/dist/typings/index')} DIFF_BINDING */
export const DIFF_BINDING = EMPTY.OBJ;

/** @typedef {import('diffhtml/dist/typings/util/types').Mount} Mount */
export const Mount = EMPTY.OBJ;