import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

const { keys } = Object;
const { stringify } = JSON;

class DevtoolsVTree extends Component {
  static defaultProps = {
    vTree: {},
  }

  state = {
    activeVTree: null,
  }

  render() {
    const { vTree } = this.props;
    const { activeVTree } = this.state;

    return html`
      <style>${this.styles()}</style>

      <div class="wrapper">
        ${this.renderVTree(vTree)}

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
    `;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.activeVTree && nextProps.mounts && nextProps.mounts[this.state.activeTab]) {
      this.state.activeVTree = nextProps.mounts[this.state.activeTab].tree;
    }
  }

  styles() {
    const { route, activeRoute } = this.props;
    const isActive = route === activeRoute;

    return `
      :host {
        display: ${isActive ? 'flex' : 'none'};
        flex: auto;
        position: relative;
        overflow-y: auto;
      }

      * { box-sizing: border-box; user-select: none; }

      pre {
        white-space: pre-wrap;
        font-weight: bold;
        padding: 10px;
        margin-top: 0;
        margin-bottom: 0;
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
        width: 100%;
      }

      .wrapper > .vtree {
        border: none;
        display: inline-block;
        overflow-y: auto;
        height: 100%;
        padding: 10px;
      }

      .vtree-header {
        margin-top: 0;
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

      .vtree:hover > .vtree-children, .vtree-children:hover {
        border-left: 2px solid #E8F4FF;
      }

      .vtree-children.inverted:hover {
        border-left: 2px solid #333738;
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
        background-color: #FAFFD4;
      }

      .vtree-header.inverted.active,
      .vtree-header.inverted:hover {
        background-color: #333738;
      }

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
        color: #607D8B;
        margin-left: 5px;
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

      .ui.inverted {
        color: rgba(255, 255, 255, 0.9);
      }
    `;
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

      return html`<div class="attributes">
        ${attrKeys.map(key => {
          const value = attributes[key];

          if (!value) {
            return html` <span class="boolean">${key}</span>`;
          }
          else if (typeof value === 'boolean') {
            return html` ${key}=<span class="boolean">${value}</span>`;
          }
          else if (typeof value === 'number') {
            return html` ${key}=<span class="number">${value}</span>`;
          }
          else {
            return html` ${key}=<span class="string">&quot;${String(value)}&quot;</span>`;
          }
        })}
      </div>`;
    };

    const childrenText = ({ childNodes }) => {
      const childTextNodes = childNodes
        .filter(x => x.nodeType === 3)
        .filter(x => x.nodeValue.trim().length);

      if (!childTextNodes.length) {
        return html``;
      }

      return html`<div class="children">${childTextNodes.map(text => html`
        <span>${text.nodeValue}</span>
      `)}</div>`;
    };

    return html`
      <div
        class="ui vtree"
        data-nodetype=${vTree.nodeType}
        ondetached=${this.removedElement}
        onattached=${this.addedElement}
      >
        <h2
          onClick=${() => this.setState({ activeVTree: vTree })}
          class="ui vtree-header ${vTree === activeVTree ? 'active' : ''}"
        >&lt;${vTree.nodeName}${attributes(vTree)}&gt; ${childrenText(vTree)}</h2>

        ${Boolean(vTree.childNodes.length) && html`
          <div class="ui vtree-children">
            ${vTree.childNodes.filter(vTree => vTree).map(vTree => {
              return this.renderVTree(vTree);
            })}
          </div>
        `}
      </div>
    `;
  }


  addedElement(targetNode, domNode) {
    //domNode.style.opacity = 0;
    //return new Promise(resolve => {
    //  domNode.animate([
    //    { opacity: 0 },
    //    { opacity: 1 },
    //  ], { duration: 200 }).onfinish = resolve;
    //}).then(() => {
    //  domNode.style.opacity = 1;
    //});
  }

  removedElement(targetNode, domNode) {
    //return new Promise(resolve => {
    //  domNode.animate([
    //    { opacity: 1 },
    //    { opacity: 0 },
    //  ], { duration: 200 }).onfinish = resolve;
    //});
  }
}

customElements.define('devtools-vtree', DevtoolsVTree);
