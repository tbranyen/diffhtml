import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

class DevtoolsPanels extends WebComponent {
  static propTypes = {
    route: String,
    activeRoute: String,
  }

  render() {
    const { route, activeRoute } = this.props;

    return html`
      <style>${this.styles()}</style>

      <div class="panel">
        ${route === activeRoute && html`<slot></slot>`}
      </div>
    `;
  }

  styles() {
    const { route, activeRoute } = this.props;
    const isActive = route === activeRoute;

    return `
      :host {
        display: ${isActive ? 'flex' : 'none'};
        flex: auto;
        position: relative;
        overflow-y: auto;
      }

      .panel {
        box-sizing: border-box;
        display: flex;
        flex: 1;
        flex-direction: column;
      }
    `;
  }
}

customElements.define('devtools-panels', DevtoolsPanels);
