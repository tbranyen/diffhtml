import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsHelpPanel extends WebComponent {
  render() {
    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Help</h3>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: #AF8585;
        border-radius: 0 !important;
        color: #FFF;
        user-select: none;
      }
    `;
  }
}

customElements.define('devtools-help-panel', DevtoolsHelpPanel);
