const Debounce = new WeakMap();
const { assign } = Object;
const $$render = Symbol.for('diff.render');

export default function setState(newState) {
  this.state = assign({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render](this);

    // To be continued...
    //Debounce.set(this, setTimeout(() => {
    //  Debounce.delete(this);

    //  if (this.shouldComponentUpdate()) {
    //    rerenderComponent(this);
    //  }
    //}));
  }
}
