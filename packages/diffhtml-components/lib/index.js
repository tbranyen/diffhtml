import wrap from './shared/wrap';
import * as implementations from './implementations';

//export { html, innerHTML, outerHTML, use, createTree } from '../../diffhtml';
export { default as PropTypes } from '../node_modules/proptypes/src';
export const Component = wrap(implementations.Component);
export const WebComponent = wrap(implementations.WebComponent);
