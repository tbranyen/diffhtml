export const Children = {
	map(children, fn, ctx) {
		if (children == null) return null;
		children = Children.toArray(children);
		if (ctx && ctx!==children) fn = fn.bind(ctx);
		return children.map(fn);
	},

	forEach(children, fn, ctx) {
		if (children == null) return null;
		children = Children.toArray(children);
		if (ctx && ctx!==children) fn = fn.bind(ctx);
		children.forEach(fn);
	},

	count(children) {
		return children && children.length || 0;
	},

	only(children) {
		children = Children.toArray(children);
		return children.length ? children[0] : null;
	},

	toArray(children) {
		return Array.isArray(children) ? children : [].concat(children);
	},
};
