/**
 * @typedef {import('./types').Config} Config
 */
import internalProcess from './process';
import globalThis from './global';

const { parseInt } = Number;
const { parse } = JSON;

/** @type {Config} */
export const globalConfig = {
  collectMetrics: true,
  executeScripts: true,
};

/**
 * Converts input to string and then coerces to the appropriate title.
 *
 * @param {unknown} value
 * @param {string} type
 *
 * @return {unknown}
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

    case 'object': {
      return parse(valueAsString);
    }
  }
}

/**
 * Request a configuration value by key. Provide a defaultValue always to ensure
 * proper type lookup. An overrides object can be passed to shortcircuit
 * lookups. Keys are looked up with a DIFF_ prefix when in the query string or
 * environment variable.
 *
 * @param {string} name
 * @param {unknown} defaultValue
 * @param {string} type
 * @param {{[name: string]: any}=} overrides
 *
 * @return {unknown}
 */
export default function getConfig(name, defaultValue, type = typeof defaultValue, overrides) {
  const { location, URLSearchParams } = globalThis;
  const hasSearchParams = typeof URLSearchParams !== 'undefined';
  const hasLocation = typeof location !== 'undefined';
  const useSearchParams = hasSearchParams && hasLocation;
  const useEnv = internalProcess.env;

  // Allow bypassing any lookups if overrides are passed and match the config
  // being looked up.
  if (overrides && name in overrides) {
    return overrides[name];
  }

  // The keyname for lookups via search params or env variable is DIFF_key and
  // is case-insensitive. This is why we lowercaes the entire lookup.
  const keyName = `DIFF_${name.replace(/[^a-zA-Z0-9]/, '')}`;

  // Try URL search params first.
  if (useSearchParams) {
    const searchParams = new URLSearchParams(location.search);
    const lowerKey = keyName.toLowerCase();

    // Use has here, because boolean values can be set with only a key.
    if (searchParams.has(lowerKey)) {
      return formatValue(decodeURIComponent(String(searchParams.get(lowerKey))), type);
    }
  }

  // Try environment variables.
  const upperKey = keyName.toUpperCase();
  if (useEnv && upperKey in internalProcess.env) {
    return formatValue(internalProcess.env[upperKey.toUpperCase()], type);
  }

  return defaultValue;
}
