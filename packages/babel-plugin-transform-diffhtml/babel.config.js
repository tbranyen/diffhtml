export default {
  env: {
    normal: {
      plugins: [['module:./dist/es/index.js', { createTree: 'html' }]]
    },
  },
};
