import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';
//import { Dropdown } from 'semantic-ui-react';

class DevtoolsMountsPanel extends Component {
  static defaultProps = {
    mounts: [],
    inspect: () => {},
    activeRoute: '',
  }

  state = {
    isExpanded: false,
    activeTab: 0,
  }

  render() {
    const { mounts = [] } = this.props;
    const { isExpanded, activeTab } = this.state;
    const { styles, setActive } = this;

    // FIXME Shouldn't need to concat and filter.
    const options = [].concat(mounts).filter(Boolean).map(({ selector }) => ({
      text: selector,
      value: selector,
    }));

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${styles()}</style>

      <div class="ui tall segment">
        <h3 onClick=${() => this.setState({ isExpanded: !isExpanded })}>
          <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Mounts
        </h3>

        ${isExpanded && html`
          <p>
            Shows the top-level rendered mounts. Attempts to create a unique
            selector for each element.
          </p>
        `}
      </div>

      ${!options.length && html`
        <p class="ui no-mounts">
          <i class="icon exclamation circle"></i>
          <strong>No mounts found, have you rendered anything?</strong>
        </p>
      `}

      ${Boolean(options.length) && html`
        <div class="ui attached tabular menu">
          ${options.map((option, i) => html`
            <div class="ui item ${activeTab === i && 'active'}">
              <a href="#" onClick=${setActive(i)}>&lt;${String(option.text).trim()}&gt;</a>
            </div>
          `)}
        </div>
      `}

      ${mounts[activeTab] && mounts[activeTab].tree && html`
        <devtools-vtree vTree=${mounts[activeTab].tree} />
      `}
    `;
  }

  shouldComponentUpdate() {
    return this.props.activeRoute === '#mounts';
  }

  styles = () => `
    :host {
      display: flex;
      height: 100vh;
      overflow: hidden;
      flex-direction: column;
    }

    * { box-sizing: border-box; user-select: none; }

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

    .no-mounts {
      padding: 16px;
    }
  `

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
