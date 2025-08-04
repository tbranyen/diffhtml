//import { parse } from 'diffhtml-rust-parser';

export default {
  env: {
    normal: {
      plugins: [['module:./dist/es/index.js', { createTree: 'html' }]]
    },
/*
    wasm: {
      plugins: [
        ['module:./dist/es/index.js', {
          createTree: 'html',
          parse,
        }]
      ]
    }*/
  },
};
