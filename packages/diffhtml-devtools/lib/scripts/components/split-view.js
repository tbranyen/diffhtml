import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

class DevtoolsSplitView extends WebComponent {
  render() {
    return html`
      <style>${this.styles()}</style>

      <div class="split-view">
        <slot></slot>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: flex;
        flex: 1;
        flex-direction: row;
        height: 100%;
      }

      .split-view {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `;
  }
}

customElements.define('devtools-split-view', DevtoolsSplitView);
