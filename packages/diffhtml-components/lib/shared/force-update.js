const Debounce = new WeakMap();
const { assign } = Object;

export default function forceUpdate() {
  const { rerenderComponent } = this.constructor;
  rerenderComponent(this);
}
