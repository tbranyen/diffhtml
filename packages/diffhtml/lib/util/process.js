import { Config } from "./types";

export default typeof process !== 'undefined' ? process : {
  env: /** @type {Config} */({ NODE_ENV: 'development' }),
  argv: /** @type {string[]} */ ([]),
};