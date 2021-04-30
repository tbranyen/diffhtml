import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DevtoolsSettingsPanel extends Component {
  state = {
    isExpanded: false,
  }

  render() {
    const { isExpanded } = this.state;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3 onclick=${() => this.setState({ isExpanded: !isExpanded })}>
          <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Settings
        </h3>

        ${isExpanded && html`
          <p>
            Alter the internals of diffHTML. Useful for toggling performance and
            changing how sampling transactions works.
          </p>
        `}
      </div>

      <div class="ui styled fluid accordion">
        <div class="title active">
          <i class="dropdown icon"></i>
          Performance
        </div>

        <div class="content active">
          <p class="transition visible" style="display: block !important;">
            <div class="ui toggle checkbox">
              <input type="checkbox">
              <label>Enable Performance Tracking</label>
            </div>
          </p>
        </div>

        <div class="title active">
          <i class="dropdown icon"></i>
          Transaction Sampling
        </div>

        <div class="content">
          <p>

          </p>
        </div>
      </div>
    `;
  }

  shouldComponentUpdate() {
    return this.props.activeRoute === '#settings';
  }

  styles() {
    return `
      :host {
        display: block;
      }

      h3 {
        cursor: pointer;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: #FFF;
        color: #333;
        border-radius: 0 !important;
        user-select: none;
      }

      .ui.accordion {
        box-shadow: none !important;
      }
    `;
  }
}

customElements.define('devtools-settings-panel', DevtoolsSettingsPanel);
