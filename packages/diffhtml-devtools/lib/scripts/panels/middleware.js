import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DevtoolsMiddlewarePanel extends Component {
  static defaultProps = {
    activeRoute: '',
    middleware: [],
  }

  state = {
    isExpanded: false,
    activeTab: 0,
    middlewareStatus: {},
  }

  render() {
    const { middleware = [] } = this.props;
    const { isExpanded, activeTab, middlewareStatus } = this.state;
    const { toggleMiddleware, setActive } = this;

    const activeMiddleware = middleware
      .sort()
      .filter(name => name !== 'Dev Tools');

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

      ${!activeMiddleware.length && html`
        <p class="ui no-middleware">
          <i class="icon exclamation circle"></i>
          <strong>No middleware found.</strong>
        </p>
      `}

      ${activeMiddleware.length && html`
        <div class="ui wrapper">
          <div class="ui attached tabular menu">
            ${activeMiddleware.map((name, i) => html`
              <div class="ui item ${i === activeTab && 'active'}" key=${name}>
                <a href="#" onClick=${setActive(i)}>${name}</a>
              </div>
            `)}
          </div>

          ${activeMiddleware.map((name, i) => html`
            <div class="ui bottom attached tab segment ${i === activeTab && 'active'}">
              <strong>Enabled</strong>
              <div class="ui toggle checkbox">
                <input
                  checked=${name in middlewareStatus ? middlewareStatus[name] : true}
                  type="checkbox"
                  onclick=${toggleMiddleware(name)}
                />
                <label></label>
              </div>
            </div>
          `)}
        </div>
      `}
    `;
  }

  shouldComponentUpdate() {
    return this.props.activeRoute === '#middleware';
  }

  styles() {
    return `
      :host {
        display: block;
      }

      * {
        box-sizing: border-box;
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
        margin-bottom: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        border-radius: 0 !important;
        background: #FFF;
        color: #333;
        user-select: none;
      }

      .ui.bottom.attached.active.tab.segment {
        padding: 20px;
      }

      .no-middleware {
        padding: 16px;
      }

      .ui.inverted {
        color: rgba(255, 255, 255, 0.9);
      }

      label {
        display: inline !important;
        margin-left: 10px;
      }
    `;
  }

  toggleMiddleware = name => ({ target }) => {
    const enabled = Boolean(target.checked);
    const type = 'toggleMiddleware';

    this.state.middlewareStatus[name] = enabled;
    this.forceUpdate();

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, {
        type,
        name,
        enabled,
      }));
    });
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-middleware-panel', DevtoolsMiddlewarePanel);
