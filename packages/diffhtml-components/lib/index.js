import wrap from './shared/wrap';
import * as implementations from './implementations/index';

export { default as PropTypes } from 'proptypes';
export const Component = wrap(implementations.Component);
export const WebComponent = wrap(implementations.WebComponent);
