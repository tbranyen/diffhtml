import process from './process';
import { Config } from './types';
import globalThis from './global';

const { parseInt } = Number;
const { parse } = JSON;
const { location, URLSearchParams } = globalThis;
const hasSearchParams = typeof URLSearchParams !== 'undefined';
const hasLocation = typeof location !== 'undefined';
const useSearchParams = hasSearchParams && hasLocation;
const useEnv = process.env;

/** @type {Config} */
export const globalConfig = {
  collectMetrics: true,
  executeScripts: true,
};

/**
 * @param {unknown} value
 * @param {string} type
 *
 * @returns {unknown}
 */
function formatValue(value, type) {
  const valueAsString = String(value);

  switch (type) {
    case 'boolean': {
      return valueAsString !== 'false';
    }

    case 'string': {
      return valueAsString;
    }

    case 'number': {
      return parseInt(valueAsString, 10);
    }

    case 'array': {
      return valueAsString.split(',');
    }

    case 'object': {
      return parse(valueAsString);
    }
  }
}

/**
 *
 * @param {string} name
 * @param {unknown} defaultValue
 * @param {string} type
 * @param {{[name: string]: unknown}=} overrides
 *
 * @return {unknown}
 */
export default function getConfig(name, defaultValue, type = typeof defaultValue, overrides) {
  // Allow bypassing any lookups if overrides are passed and match the config
  // being looked up.
  if (overrides && name in overrides) {
    return overrides[name];
  }

  // The keyname for lookups via search params or env variable is DIFF_key and
  // is case-insensitive. This is why we lowercaes the entire lookup.
  const keyName = `DIFF_${name.replace(/[^a-zA-Z0-9]/, '')}`.toLowerCase();

  // Try URL search params first.
  if (useSearchParams) {
    const searchParams = new URLSearchParams(location.search);

    // Use has here, because boolean values can be set with only a key.
    if (searchParams.has(keyName)) {
      return formatValue(decodeURIComponent(String(searchParams.get(keyName))), type);
    }
  }

  // Try environment variables.
  if (useEnv && keyName in process.env) {
    return formatValue(process.env[keyName], type);
  }

  return defaultValue;
}