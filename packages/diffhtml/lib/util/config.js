import process from './process';
import { Config } from './types';
import globalThis from './global';

const { location, URLSearchParams } = globalThis;
const hasSearchParams = typeof URLSearchParams !== 'undefined';
const hasLocation = typeof location !== 'undefined';
const hasSearch = hasSearchParams && hasLocation;
const hasEnv = process.env;

/** @type {Config} */
export const globalConfig = {
  collectMetrics: true,
  executeScripts: true,
};

function getValue(value, type) {
  switch (type) {
    case 'boolean': {

    }
  }
}

/**
 *
 * @param {String} name
 * @param {unknown} defaultValue
 * @param {string} type
 * @param {{[name: string]: unknown}=} override
 *
 * @return {unknown}
 */
export default function getConfig(name, defaultValue, type = typeof defaultValue, override) {
  const keyName = `DIFF_${name.replace(/[^a-zA-Z0-9]/, '').toLowerCase()}`;

  // Allow bypassing any lookups.
  if (override && name in override) {
    return override[name];
  }

  const searchParams = new URLSearchParams(location.search);
  const wantsSearch = hasSearch && searchParams.has(keyName);
  const searchValue = searchParams.get(keyName);

  // Querystring parameter has highest precedence.
  if (wantsSearch) {
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