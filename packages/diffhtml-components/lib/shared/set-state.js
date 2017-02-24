const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(newState) {
  const { rerenderComponent } = this.constructor;

  this.state = assign({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    rerenderComponent(this);

    Debounce.set(this, setTimeout(() => {
      Debounce.delete(this);
      rerenderComponent(this);
    }));
  }
}
