import webpack from 'webpack';
import config from './webpack.config.mjs';

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
      'diffhtml-rust-parser/dist/parser_bg.wasm': './empty.js',
      'diffhtml-rust-parser': './empty.js',
    },
  },
};
