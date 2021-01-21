import diff, { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

class DevtoolsHelpPanel extends WebComponent {
  static propTypes = {
    theme: String,
    activeRoute: String,
    version: Number,
  }

  state = {
    isExpanded: false,
    activeTab: 'chat',
    source: `
      diff.innerHTML(document.body, diff.html\`
        <h1>Live Sandbox</h1>
      \`);
    `,
  }

  updateSource = ev => {
    this.setState({ source: ev.target.value });
  }

  render() {
    const { theme, version } = this.props;
    const { source, isExpanded, activeTab } = this.state;
    const { setActive, updateSource } = this;

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
          <!--
          <div class="ui item ${activeTab === 'repl' && 'active'}">
            <a href="#" onClick=${setActive('repl')}>REPL</a>
          </div>
          -->
          <div class="ui item ${activeTab === 'chat' && 'active'}">
            <a href="#" onClick=${setActive('chat')}>Chat</a>
          </div>
          <div class="ui item ${activeTab === 'about' && 'active'}">
            <a href="#" onClick=${setActive('about')}>About</a>
          </div>
          <!--
          <div class="ui item ${activeTab === 'api' && 'active'}">
            <a href="#" onClick=${setActive('api')}>API Reference</a>
          </div>
          -->
        </div>

        <div class="ui bottom attached tab repl segment ${activeTab === 'repl' && 'active'}">
          <textarea value=${source} oninput=${updateSource} />
          <iframe
            onload=${ev => {
              ev.target.contentWindow.diff = diff;
            }}
            srcdoc=${`
            <!doctype html>

            <html>
              <head></head>
              <body>
                Testing
              </body>
            </html>
          `} />
        </div>

        <div class="ui bottom attached tab about segment ${activeTab === 'about' && 'active'}">
          <p>
            <div class="ui logo" src="/icons/logo-128.png" />
            <h3 class="version">diffHTML: ${version}</h3>
          </p>
        </div>

        <div class="ui bottom attached tab segment ${activeTab === 'chat' && 'active'}">
          <iframe frameborder="0" src="https://gitter.im/tbranyen/diffhtml/~embed?env=%7B%22basePath%22%3A%22chrome-extension%3A%2F%2Fkmelgoilbhnakpkabonlenccgajjipdd%22%7D"></iframe>
        </div>

        <div class="ui bottom attached tab segment ${activeTab === 'api' && 'active'}">
          <iframe frameborder="0" src="https://diffhtml.org/api.html"></iframe>
        </div>
      </div>
    `;
  }

  componentDidUpdate() {
    if (this.state.activeTab !== 'repl') {
      const iframe = this.querySelector('iframe');
      iframe && iframe.focus();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.activeRoute === '#help';
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

      .tab.repl.active, .tab.about.active > p:first-child {
        display: flex !important;
        flex-direction: row !important;
      }

      .tab.repl > * {
        flex: 1;
        width: 100%;
      }

      .ui.logo {
        width: 128px;
        height: 128px;
        display: inline-block;

        background-image: url(/icons/logo-128.png);
      }

      .ui.logo.inverted {
        background-image: url(/icons/logo-128-invert.png);
      }

      .tab.about {
        padding: 20px !important;
        padding-top: 0 !important;
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;
        margin-bottom: 0;
      }

      .version {
        padding: 30px;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-help-panel', DevtoolsHelpPanel);
