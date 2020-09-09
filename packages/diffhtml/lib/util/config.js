import process from './process';
import { Config, Internals } from './types';
import globalThis from './global';

const hasSearch = typeof globalThis.location !== 'undefined';
const hasEnv = process.env;

/** @type {Config} */
export const globalConfig = {
  collectMetrics: true,
  executeScripts: true,
};

/**
 *
 * @param {String} name
 * @param {unknown} defaultValue
 * @param {{[name: string]: unknown}=} override
 *
 * @return {unknown}
 */
export default function getConfig(name, defaultValue, override) {
  const searchName = `diff_${name.toLowerCase()}`;
  const envName = `DIFF_${name.toUpperCase()}`;

  if (override && name in override) {
    return override[name];
  }

  // FIXME
  if (hasSearch && location.search.includes(searchName)) {
    return true;
  }
  // else if (hasEnv) {
  //   return [hasEnv, 'env'];
  // }

  // Support env var
  // Support query string diff_config_name=
  // Support passing at transaction time
  return defaultValue;
}