import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsFooter extends WebComponent {
  static propTypes = {
    version: PropTypes.string,
  }

  render() {
    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui search">
        <div class="ui left aligned icon input">
          <input class="prompt" type="text" placeholder="Search for Components / Values/ Changes...">
          <i class="search icon"></i>
        </div>

        <slot></slot>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        background-color: #fff;
        color: #333;
        padding: 16px;
        font-weight: bold;
        text-align: right;
        border-top: 1px solid rgba(34, 36, 38, 0.1);
        z-index: 200;
        position: relative;
      }

      .icon.input {
        width: calc(100% - 540px);
        margin-right: 30px;
      }
    `;
  }
}

customElements.define('devtools-footer', DevtoolsFooter);
