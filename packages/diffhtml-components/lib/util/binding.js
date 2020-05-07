import globalThis from './global';

export function getBinding() {
  return globalThis[Symbol.for('diffHTML')];
}
