//import { Dropdown } from 'semantic-ui-react'
import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

const { stringify } = JSON;
const hasNonWhitespaceEx = /\S/;

class DevtoolsMountsPanel extends WebComponent {
  static propTypes = {
    mounts: PropTypes.array,
    inspect: PropTypes.func,
  }

  state = {
    index: 0,
    isExpanded: false,
    activeVTree: null,
  }

  changeIndex = ({ target }) => this.setState({ index: target.selectedIndex })

  render() {
    const { mounts = [] } = this.props;
    const { index, isExpanded, activeVTree } = this.state;
    const { styles, changeIndex } = this;

    const options = mounts.map(({ selector }) => ({
      text: selector,
      value: selector,
    }));

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${styles()}</style>

      <div class="ui tall segment">
        <h3 onclick=${() => this.setState({ isExpanded: !isExpanded })}>
          <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Mounts
        </h3>

        ${isExpanded && html`
          ${options.length && html`
            <select oninput=${changeIndex}>
              ${options.map(option => html`
                <option value=${option.value}>${option.text}</option>
              `)}
            </select>
          `}
        `}
      </div>

      ${false && html`
        <${Dropdown}
          placeholder='Select DOM Node'
          fluid
          selection
          value=${options[0] && options[0].value}
          options=${options}
        />
      `}

      ${!options.length && html`
        <p>
          <i class="icon exclamation circle"></i>
          <strong>No mounts found, have you rendered anything?</strong>
        </p>
      `}

      ${Boolean(options.length) && html`
        <div class="ui mini icon input">
          <input type="text" placeholder="Filter nodes">
          <i class="search icon"></i>
        </div>
      `}

      ${mounts[index] && mounts[index].tree && html`
        <div class="wrapper">
          ${this.renderVTree(mounts[index].tree)}

          ${activeVTree && html`
            <div class="vtree-sidepanel">
              <h4>Raw NodeName</h4>

              ${activeVTree && html`
                <pre><code>${activeVTree.rawNodeName.toString()}</code></pre>
              `}

              <h4>Attributes</h4>

              ${activeVTree && html`
                <pre><code>${stringify(activeVTree.attributes, null, 2)}</code></pre>
              `}
            </div>
          `}
        </div>
      `}
    `;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.activeVTree && nextProps.mounts[this.state.index]) {
      this.state.activeVTree = nextProps.mounts[this.state.index].tree;
    }
  }

  renderVTree(vTree) {
    const isTextNode = vTree && vTree.nodeType === 3;
    const { activeVTree } = this.state;

    if (isTextNode) {
      return html``;
    }

    return html`
      <div
        class="vtree"
        data-nodetype=${vTree.nodeType}
      >
        <h2
          onClick=${() => this.setState({ activeVTree: vTree })}
          class="vtree-header ${vTree === activeVTree ? 'active' : ''}"
        >
          ${`&lt;${vTree.nodeName}&gt;`}
        </h2>

        ${Boolean(vTree.childNodes.length) && html`
          <div class="vtree-children">
            ${vTree.childNodes.filter(vTree => vTree).map(vTree => {
              const hasNonWhitespace = hasNonWhitespaceEx.test(vTree.nodeValue);
              return this.renderVTree(vTree);
            })}
          </div>
        `}
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: flex;
        height: 100vh;
        overflow: hidden;
        flex-direction: column;
      }

      * { box-sizing: border-box; }

      h2 {
        font-size: 13px;
      }

      h3 {
        cursor: pointer;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        margin-bottom: 0;
        top: 0;
        z-index: 100;
        border-radius: 0 !important;
        color: #333;
        user-select: none;
      }

      .ui.mini.icon.input input {
        border-radius: 0;
        border-left: 0;
        border-right: 0;
        border-top: 0;
      }

      select {
        width: 100%;
        padding: 10px;
      }

      pre {
        white-space: pre-wrap;
      }

      .vtree {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 20px;
        padding-top: 0px;
        padding-bottom: 0px;
        width: 100%;
        border: none;
      }

      .wrapper {
        display: flex;
        font-size: 11px;
        padding: 10px;
        overflow: hidden;
      }

      .wrapper > .vtree {
        border: none;
        display: inline-block;
        overflow-y: auto;
        height: 100%;
        padding-left: 0px;
      }

      .vtree-header {
        margin-bottom: 0;
        padding: 5px;
        cursor: pointer;
        user-select: none;
        flex: 1;
        display: block;
        width: 100%;
        border-size: 2px solid transparent;
      }

      .vtree.active .vtree-header,
      .vtree-header:hover {
        color: #FFF;
      }

      .vtree-children:hover {
        border-left: 2px solid #E8F4FF;
      }

      .vtree-children {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: wrap;
        border-left: 2px solid transparent;
      }

      .vtree-header.active,
      .vtree-header:hover {
        color: #1E70BF;
        background-color: #E8F4FF;
      }

      .vtree-sidepanel {
        width: 30%;
        display: inline-block;
        border-left: 1px solid #E0E0E0;
        padding-left: 20px;
      }
    `;
  }
}

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
