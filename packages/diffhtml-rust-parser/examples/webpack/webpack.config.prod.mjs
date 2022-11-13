import webpack from 'webpack';
import config from './webpack.config.mjs';
import VirtualModulesPlugin from 'webpack-virtual-modules';

const virtualModules = new VirtualModulesPlugin({
  './empty.js': `
    export const parse = () => {};
  `,
});

export default {
  ...config,

  mode: 'production',

  optimization: {
    minimize: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)|(\.wasm$)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },

  resolve: {
    alias: {
      'diffhtml': 'diffhtml/dist/es/lite.js',
      'diffhtml-rust-parser': './empty.js',
    },
  },

  plugins: [ virtualModules ],
};
