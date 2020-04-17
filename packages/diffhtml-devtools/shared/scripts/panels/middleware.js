import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsMiddlewarePanel extends WebComponent {
  static propTypes = {
    middleware: PropTypes.array
  }

  state = {
    isExpanded: false,
  }

  render() {
    const { middleware = [] } = this.props;
    const { isExpanded } = this.state;
    const { toggleMiddleware } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3 onclick=${() => this.setState({ isExpanded: !isExpanded })}>
          <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Middleware
        </h3>

        ${isExpanded && html`
          <p>
            View and enable/disable the various middleware registered in the
            application.
          </p>
        `}
      </div>

      <form>
        ${middleware.sort().map(name => html`
          <div class="middleware" key=${name}>
            <div class="ui toggle checkbox" >
              <input
                checked
                type="checkbox"
                ${name === 'Dev Tools' && 'disabled'}
                onclick=${toggleMiddleware(name)}
              />
              <label>${name}</label>
            </div>
          </div>
        `)}
      </form>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      h3 {
        cursor: pointer;
      }

      .middleware {
        margin-top: 20px;
        margin-left: 20px;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        border-radius: 0 !important;
        background: #FFF;
        color: #333;
        user-select: none;
      }
    `;
  }

  toggleMiddleware = name => ({ target }) => {
    const enabled = Boolean(target.checked);
    const type = 'toggleMiddleware';

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, {
        type,
        name,
        enabled,
      }));
    });
  }
}

customElements.define('devtools-middleware-panel', DevtoolsMiddlewarePanel);
