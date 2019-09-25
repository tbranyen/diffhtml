import React from 'react'
import { Dropdown } from 'semantic-ui-react'

import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

const hasNonWhitespaceEx = /\S/;

class DevtoolsMountsPanel extends WebComponent {
  static propTypes = {
    mounts: PropTypes.array,
  }

  state = {
    index: 0,
  }

  changeIndex = ({ target }) => this.setState({ index: target.selectedIndex })

  render() {
    const { mounts = [] } = this.props;
    const { index } = this.state;
    const { styles, changeIndex, renderVTree } = this;

    const options = mounts.map(({ selector }) => ({
      text: selector,
      value: selector,
    }));

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${styles()}</style>

      <div class="ui tall segment">
        <h3>Mounts</h3>

        ${options.length && html`
          <select oninput=${changeIndex}>
            ${options.map(option => html`
              <option value=${option.value}>${option.text}</option>
            `)}
          </select>
        `}

        <!--
        <Dropdown
          placeholder='Select DOM Node'
          fluid
          selection
          value=${options[0] && options[0].value}
          options=${options}
        />
        -->
      </div>


      ${!options.length && html`
        <strong>No mounts found, this is most likely an error</strong>
      `}

      ${mounts[index] && html`
        <div class="wrapper">
          ${renderVTree(mounts[index].tree)}
        </div>
      `}
    `;
  }

  renderVTree(vTree) {
    return html`
      <div class="vtree" data-nodetype=${vTree.nodeType}>
        <h2 class="vtree-header">&lt;${vTree.nodeName} /&gt;</h2>

        ${Boolean(vTree.childNodes.length) && html`
          <div class="vtree-children">
            ${vTree.childNodes.map(vTree => {
              const hasNonWhitespace = hasNonWhitespaceEx.test(vTree.nodeValue);

              if (vTree.nodeType !== 3 || hasNonWhitespace) {
                return this.renderVTree(vTree);
              }
            })}
          </div>
        `}
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
        margin-bottom: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        border-radius: 0 !important;
        background: #FFF;
        color: #333;
        user-select: none;
      }

      select {
        width: 100%;
        padding: 10px;
      }

      .vtree {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        min-height: 48px;
        padding: 20px;
        width: 100%;
        border: 1px solid #F1F1F1;
        border-top: none;
        border-left: none;
      }

      .vtree:first-child {
        border-left: 1px solid #F1F1F1;
      }

      .vtree-header {
        margin-bottom: 0;
        padding: 5px 21px;
        background: #f1f1f1;
        border-radius: 0;
        cursor: pointer;
        transition: all linear 240ms;
        user-select: none;
        flex: 1;
        display: block;
        width: 100%;
      }

      .vtree.active .vtree-header,
      .vtree-header:hover {
        color: #FFF;
        background-color: #737373;
      }

      .vtree-children {
        display: flex;
        flex-direction: row;
        width: 100%;
      }
    `;
  }
}

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
