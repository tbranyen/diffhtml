//import { Dropdown } from 'semantic-ui-react'
import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

const { keys } = Object;
const { stringify } = JSON;
const hasNonWhitespaceEx = /\S/;

class DevtoolsMountsPanel extends WebComponent {
  static propTypes = {
    mounts: PropTypes.array,
    inspect: PropTypes.func,
    theme: PropTypes.string,
  }

  state = {
    isExpanded: false,
    activeVTree: null,
    activeTab: 0,
  }

  render() {
    const { mounts = [] } = this.props;
    const { isExpanded, activeVTree, activeTab } = this.state;
    const { styles, setActive } = this;

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
          <p>
            Shows the rendered VTree for a given mount point. This could be a
            top-level render or a component rendering itself.
          </p>
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
        <p class="no-mounts">
          <i class="icon exclamation circle"></i>
          <strong>No mounts found, have you rendered anything?</strong>
        </p>
      `}

      ${Boolean(options.length) && html`
        <div class="ui attached tabular menu">
          ${options.map((option, i) => html`
            <div class="item ${activeTab === i && 'active'}">
              <a href="#" onClick=${setActive(i)}>&lt;${option.text}&gt;</a>
            </div>
          `)}
        </div>
      `}

      ${mounts[activeTab] && mounts[activeTab].tree && html`
        <div class="wrapper">
          ${this.renderVTree(mounts[activeTab].tree)}

          ${activeVTree && html`
            <div class="vtree-sidepanel">
              <h4>Node name</h4>

              ${activeVTree && html`
                <pre><code>${activeVTree.nodeName.toString()}</code></pre>
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
    if (!this.state.activeVTree && nextProps.mounts[this.state.activeTab]) {
      this.state.activeVTree = nextProps.mounts[this.state.activeTab].tree;
    }
  }

  addedElement(domNode) {
    return new Promise(resolve => {
      domNode.animate([
        { background: 'transparent' },
        { background: '#E1FFE1' },
        { background: 'transparent' },
      ], { duration: 200 }).onfinish = resolve;
    });
  }

  removedElement(domNode) {
    return new Promise(resolve => {
      domNode.animate([
        { background: 'transparent' },
        { background: '#FFE1E1' },
        { background: 'transparent' },
      ], { duration: 200 }).onfinish = resolve;
    });
  }

  renderVTree(vTree) {
    const { activeVTree } = this.state;
    const isTextNode = vTree && vTree.nodeType === 3;

    if (isTextNode) {
      return html``;
    }

    const attributes = ({ attributes }) => {
      const attrKeys = keys(attributes);

      if (!attrKeys.length) {
        return html``;
      }

      return html`<div class="attributes">${attrKeys.map(key => {
        const value = attributes[key];

        if (!value) {
          return html` <span class="boolean">${key}</span>`;
        }
        else if (typeof value === 'string') {
          return html` ${key}=<span class="string">"${value}"</span>`;
        }
        else if (typeof value === 'boolean') {
          return html` ${key}=<span class="boolean">${value}</span>`;
        }
        else if (typeof value === 'number') {
          return html` ${key}=<span class="number">${value}</span>`;
        }
      })}</div>`;
    };

    const childrenText = ({ childNodes }) => {
      const childTextNodes = childNodes
        .filter(x => x.nodeType === 3)
        .filter(x => x.nodeValue.trim().length);

      if (!childTextNodes.length) {
        return html``;
      }

      return html`<div class="children">${childTextNodes.map(text => html`
        <span>#text ${text.nodeValue}</span>
      `)}</div>`;
    };

    return html`
      <div
        class="vtree"
        data-nodetype=${vTree.nodeType}
        ondetached=${this.removedElement}
        onattached=${this.addedElement}
      >
        <h2
          onClick=${() => this.setState({ activeVTree: vTree })}
          class="vtree-header ${vTree === activeVTree ? 'active' : ''}"
        >&lt;${vTree.nodeName}${attributes(vTree)}&gt; ${childrenText(vTree)}</h2>

        ${Boolean(vTree.childNodes.length) && html`
          <div class="vtree-children">
            ${vTree.childNodes.filter(vTree => vTree).map(vTree => {
              return this.renderVTree(vTree);
            })}
          </div>
        `}
      </div>
    `;
  }

  styles = () => {
    const { theme } = this.props;

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
        font-weight: bold;
        padding: 10px;
        margin-top: 0;
        margin-bottom: 0;
      }

      .no-mounts {
        padding: 16px;
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
        overflow: hidden;
      }

      .wrapper > .vtree {
        border: none;
        display: inline-block;
        overflow-y: auto;
        height: 100%;
        padding: 10px;
      }

      .vtree-header {
        margin-bottom: 0;
        padding: 5px;
        cursor: pointer;
        user-select: none;
        flex: 1;
        display: block;
        width: 100%;
        font-family: dejavu sans mono, monospace;
        font-size: 10px;
        color: #5a5a5a;
      }

      .vtree.active .vtree-header,
      .vtree-header:hover {
        color: #FFF;
      }

      ${theme === 'dark' ? `
        .vtree-children:hover {
          border-left: 2px solid #333738;
        }
      ` : `
        .vtree-children:hover {
          border-left: 2px solid #E8F4FF;
        }
      `}

      .vtree-children {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: wrap;
        border-left: 2px solid transparent;
      }

      ${theme === 'dark' ? `
        .vtree-header.active,
        .vtree-header:hover {
          background-color: #333738;
        }
      ` : `
        .vtree-header.active,
        .vtree-header:hover {
          color: #1E70BF;
          background-color: #FAFFD4;
        }
      `}

      .vtree-sidepanel {
        width: 50%;
        display: inline-block;
        border-left: 1px solid #E0E0E0;
      }

      .vtree-sidepanel h4 {
        color: #1E70BF;
        background: #E8F4FF;
        padding: 10px;
        margin-bottom: 0;
        margin-top: 0;
      }

      .attributes {
        display: inline-block;
        margin-left: 5px;
        color: #607D8B;
      }

      .string {
        color: #A5448F;
      }

      .boolean {
        color: #60B764;
      }

      .children {
        display: inline-block;
        color: #a9a9a9;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
