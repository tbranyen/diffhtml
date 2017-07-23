import React from 'react'
import { Dropdown } from 'semantic-ui-react'

import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsMountsPanel extends WebComponent {
  static propTypes = {
    mounts: PropTypes.array,
  }

  render() {
    const { mounts = [] } = this.props;

    const options = mounts.map(({ selector }) => ({
      text: selector,
      value: selector,
    }));

    const Dropdown = () => {};
    const test = 'lol';

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Mounts</h3>

        <${Dropdown}
          placeholder='Select DOM Node'
          fluid
          selection
          options=${options}
        />
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      * { box-sizing: border-box; }

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

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
