import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, 'dist');

export default {
  mode: 'development',
  entry: {
    index: './index.js'
  },
  output: {
    path: dist,
    filename: 'build.js',
    publicPath: '/dist/',
    clean: true,
  },
  experiments: {
    futureDefaults: true,
  },
  devServer: {
    static: {
      directory: '.',
    }
  }
};
