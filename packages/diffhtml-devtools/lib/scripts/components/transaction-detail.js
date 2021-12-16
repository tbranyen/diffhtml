import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';
import formatPatches from '../utils/format-patches';

class DevtoolsTransactionDetail extends Component {
  static defaultProps = {
    transaction: {},
    stats: {},
    closeDetail: () => {},
  }

  state = {
    activeTab: 'patches',
  }

  render() {
    const { transaction, closeDetail } = this.props;
    const { activeTab } = this.state;
    const { setActive } = this;
    const formatted = formatPatches(transaction.args.patches);

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui attached tabular menu">
        <i class="ui icon close" onClick=${closeDetail} />

        <div class="ui item ${activeTab === 'patches' ? 'active' : ''}">
          <a href="#" onClick=${setActive('patches')}>
            Patches
            <span class="ui teal label">${String(formatted.length)}</span>
          </a>
        </div>

        <div class="ui item ${activeTab === 'vtree' ? 'active' : ''}">
          <a href="#" onClick=${setActive('vtree')}>VTree</a>
        </div>

        <div class="ui item ${activeTab === 'config' ? 'active' : ''}">
          <a href="#" onClick=${setActive('config')}>Config</a>
        </div>
      </div>

      ${activeTab === 'patches' && html`
        <div class="ui fluid search">
          <div class="ui fluid icon input">
            <input class="prompt" type="text" placeholder=${'Selectors <li>, text "hello world", type node'}>
            <i class="search icon"></i>
          </div>
          <div class="results"></div>
        </div>
      `}

      <div class="ui attached tab segment ${activeTab === 'patches' ? 'active' : ''}">
        ${activeTab === 'patches' && html`
          <div class="ui divided list">
            ${formatted.map(({ type, name, vTree, newTree, refTree, oldValue, newValue }) => html`
              <div class="item">
                ${type === 'setAttribute' && html`
                  <a class="item">
                    <div class="ui blue horizontal label">ATTR</div>
                    Setting attribute ${name} in <span class="node" childNodes=${`<${vTree.nodeName}>`} /> to ${JSON.stringify(newValue)}
                  </a>
                `}

                ${type === 'removeAttribute' && html`
                  <a class="item">
                    <div class="ui red horizontal label">ATTR</div>
                    Removing attribute ${name} in <span class="node" childNodes=${`<${vTree.nodeName}>`} />
                  </a>
                `}

                ${type === 'nodeValue' && html`
                  <a class="item">
                    <div class="ui olive horizontal label">TEXT</div>
                    Setting nodeValue in <span class="node" childNodes=${`<${vTree.nodeName}>`} /> to ${JSON.stringify(newValue)} from ${JSON.stringify(oldValue)}
                  </a>
                `}

                ${type === 'insertBefore' && html`
                  <a class="item">
                    <div class="ui pink horizontal label">NODE</div>
                    Inserting <span class="node" childNodes=${`<${newTree.nodeName}>`} /> into <span class="node" childNodes=${`<${vTree.nodeName}>`} />
                    ${JSON.stringify(oldValue)}
                    ${Boolean(refTree) && html`
                      before ${refTree.nodeName}
                    `}
                  </a>
                `}

                ${type === 'replaceChild' && html`
                  <a class="item">
                    <div class="ui violet horizontal label">NODE</div>
                    Replacing <span class="node" childNodes=${`<${oldTree.nodeName}>`} /> with <span class="node" childNodes=${`<${newTree.nodeName}>`} />
                  </a>
                `}

                ${type === 'removeChild' && html`
                  <a class="item">
                    <div class="ui orange horizontal label">NODE</div>
                    Removing <span class="node" childNodes=${`<${vTree.nodeName}>`} />
                  </a>
                `}
              </div>
            `)}
          </div>
        `}
      </div>

      <div class="ui attached tab segment ${activeTab === 'vtree' ? 'active' : ''}">
        <devtools-vtree vTree=${transaction.args.state.oldTree} />
      </div>

      ${activeTab === 'config' && html`
        <div class="ui attached tab segment active">
          <pre>
            ${JSON.stringify(transaction.args.config, null, 2)}
          </pre>
        </div>
      `}
    `;
  }

  styles() {
    return `
      :host {
        display: flex;
        flex-direction: column;
        vertical-align: inherit;
        border-color: inherit;
        user-select: none;
        max-height: 100%;
      }

      :host(.inverted) {
        border-top: 2px solid #424242;
      }

      .node {
        color: #91248A;
        font-family: "dejavu sans mono", monospace;
        font-size: 11px;
      }

      .ui.search {
        padding: 10px;
      }

      .ui.bottom.menu {
        display: flex;
        flex: auto;
        position: relative;
        overflow-y: auto;
      }

      .ui.close {
        padding: 15px;
        cursor: pointer;
      }

      .ui.attached.tab {
        overflow-y: auto;
        height: 100%;
        max-height: 100%;
      }

      .ui.styled.accordion {
        border-top: none;
        box-shadow: none;
      }

      .ui.divided.list .item {
        padding: 10px;
        padding-left: 5px;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-transaction-detail', DevtoolsTransactionDetail);
