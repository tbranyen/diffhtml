export function getBinding() {
  return globalThis[Symbol.for('diffHTML')];
}
