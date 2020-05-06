import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsHelpPanel extends WebComponent {
  static propTypes = {
    theme: PropTypes.string,
  }

  state = {
    isExpanded: false,
    activeTab: 'chat',
  }

  render() {
    const { theme } = this.props;
    const { isExpanded, activeTab } = this.state;
    const { setActive } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3 onclick=${() => this.setState({ isExpanded: !isExpanded })}>
          <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Help
        </h3>
      </div>

      <div class="wrapper">
        <div class="ui attached tabular menu">
          <div class="item ${activeTab === 'chat' && 'active'}">
            <a href="#" onClick=${setActive('chat')}>Chat</a>
          </div>
          <div class="item ${activeTab === 'api' && 'active'}">
            <a href="#" onClick=${setActive('api')}>API Reference</a>
          </div>
        </div>

        <div class="ui bottom attached active tab segment">
          ${activeTab === 'chat' && html`
            <iframe frameborder="0" src="https://gitter.im/tbranyen/diffhtml/~embed?env=%7B%22basePath%22%3A%22chrome-extension%3A%2F%2Fkmelgoilbhnakpkabonlenccgajjipdd%22%7D"></iframe>
          `}

          ${activeTab === 'api' && html`
            <iframe frameborder="0" src="https://diffhtml.org/api.html"></iframe>
          `}
        </div>
      </div>
    `;
  }

  componentDidMount() {
    this.querySelector('iframe').focus();
  }

  styles() {
    return `
      :host {
        display: flex;
        height: 100vh;
        overflow: hidden;
        flex-direction: column;
        box-sizing: border-box;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        margin-bottom: 0;
        z-index: 100;
        border-radius: 0 !important;
        background: #FFF;
        color: #333;
        user-select: none;
        cursor: pointer;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        font-size: 11px;
        overflow: hidden;
        height: 100%;
      }

      .wrapper iframe {
        width: 100%;
        height: 100%;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-help-panel', DevtoolsHelpPanel);
