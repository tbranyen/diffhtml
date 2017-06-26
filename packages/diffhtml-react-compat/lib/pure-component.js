export default class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextPropKeys = keys(nextProps);
    const nextStateKeys = keys(nextState);

    if (nextPropKeys.length !== keys(this.props).length) {
      return true;
    }
    else if (nextStateKeys.length !== keys(this.state).length) {
      return true;
    }

    let isDirty = false;

    nextPropsKeys.forEach(keyName => {
      if (isDirty) { return; }

      if (this.props[keyName] !== nextProps[keyName]) {
        isDirty = true;
      }
    });

    if (isDirty) {
      return true;
    }

    nextStateKeys.forEach(keyName => {
      if (isDirty) { return; }

      if (this.state[keyName] !== nextState[keyName]) {
        isDirty = true;
      }
    });

    return isDirty;
  }
}
