import { innerHTML, createTree } from 'diffhtml';
import WebComponent from './lib/web-component';
import PropTypes from 'proptypes';

class extends WebComponent {
  render({ message }) {
    return (
      <div>{message}</div>
    );
  }

  static propTypes = {
    message: PropTypes.string.isRequired,
  }
}

innerHTML(document.body, <jsx-test message="Hello world!" />);
