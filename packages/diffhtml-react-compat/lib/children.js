export function map(children, fn, ctx) {
  if (children === undefined || children === null) {
    return null;
  }

  children = toArray(children);

  if (ctx && ctx !== children) {
    fn = fn.bind(ctx);
  }

  return children.map(fn);
}

export function forEach(children, fn, ctx) {
  if (children === undefined || children === null) {
    return null;
  }

  children = toArray(children);

  if (ctx && ctx !== children) {
    fn = fn.bind(ctx);
  }

  children.forEach(fn);
}

export function count(children) {
  return children ? children.length : 0;
}

export function only(children) {
  children = toArray(children);

  return children.length ? children[0] : null;
}

export function toArray(children) {
  return Array.isArray(children) ? children : [].concat(children);
}

export default { map, forEach, count, only, toArray };
