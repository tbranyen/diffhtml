import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsMiddlewarePanel extends WebComponent {
  static propTypes = {
    middleware: PropTypes.array
  }

  render() {
    const { middleware = [] } = this.props;
    const { toggleMiddleware } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Middleware</h3>

        <p>
          View and enable/disable the various middleware registered in the
          application.
        </p>
      </div>

      <form>
        ${middleware.sort().map(name => html`
          <div class="middleware">
            <div class="ui toggle checkbox" onclick=${toggleMiddleware(name)}>
              <input checked type="checkbox" ${name === 'Dev Tools' && 'disabled'} />
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

  toggleMiddleware = name => ({ currentTarget }) => {
    const enabled = Boolean(currentTarget.querySelector('input').checked);

    chrome.tabs.query({ active:true, currentWindow:true }, tabs => {
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { name, enabled }));
    });
  }
}

customElements.define('devtools-middleware-panel', DevtoolsMiddlewarePanel);
