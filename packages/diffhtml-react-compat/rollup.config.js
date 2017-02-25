import path from 'path';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

const { keys } = Object;
const pkg = require('./package.json');
const external = keys(pkg.peerDependencies || {}).concat(keys(pkg.dependencies || {}));

export default {
	entry: 'src/index.js',
	dest: pkg.main,
	sourceMap: path.resolve(pkg.main),
	moduleName: pkg.amdName,
	format: 'umd',
	useStrict: false,
	external,
	plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    babel(),
    nodeResolve({
			jsnext: true,
			main: true,
			skip: external,
    }),
	]
};
