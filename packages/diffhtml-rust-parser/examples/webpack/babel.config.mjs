import { parse } from 'diffhtml-rust-parser';
import transformPlugin from 'babel-plugin-transform-diffhtml';

export default {
  plugins: [
    [transformPlugin, { createTree: 'html', parse }]
  ],
};
