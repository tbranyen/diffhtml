import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DevtoolsTransactionDetail extends Component {
  static propTypes = {
    transaction: Object,
    stats: Object,
    closeDetail: Function,
  }

  state = {
    activeTab: 'patches',
  }

  render() {
    const { transaction, closeDetail } = this.props;
    const { activeTab } = this.state;
    const { setActive } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui attached tabular menu">
        <i class="ui icon close" onClick=${closeDetail} />

        <div class="ui item ${activeTab === 'patches' && 'active'}">
          <a href="#" onClick=${setActive('patches')}>
            Patches
            <span class="ui teal label">${String(transaction.args.patches.length)}</span>
          </a>
        </div>

        <div class="ui item ${activeTab === 'diff' && 'active'}">
          <a href="#" onClick=${setActive('diff')}>Diff</a>
        </div>
      </div>

      <div class="ui bottom attached tab segment ${activeTab === 'patches' && 'active'}">
        <div class="ui styled fluid accordion">
          <div class="title">
            <i class="dropdown icon"></i>
          </div>
          <div class="content">
          </div>
          <div class="content active">
          </div>
        </div>
      </div>

      <div class="ui bottom attached tab segment ${activeTab === 'diff' && 'active'}">
        <devtools-vtree vTree=${transaction.args.state.oldTree} />
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        user-select: none;
        border-top: 2px solid #DEDEDE;
      }

      :host(.inverted) {
        border-top: 2px solid #424242;
      }

      .ui.close {
        padding: 15px;
        cursor: pointer;
      }

      .ui.tab.attached {
        overflow-y: auto;
      }

      .ui.styled.accordion {
        border-top: none;
        box-shadow: none;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-transaction-detail', DevtoolsTransactionDetail);
