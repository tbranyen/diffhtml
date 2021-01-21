import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';
import SemanticUITable from '../semantic-ui/table';

class DevtoolsTransactionsPanel extends WebComponent {
  static propTypes = {
    inProgress: PropTypes.array,
    completed: PropTypes.array,
    inspect: PropTypes.func,
  }

  state = {
    isExpanded: false,
    expandedIndex: -1,
    expandedState: null,
    autoScroll: true,
    hideEmpty: false,
  }

  render() {
    const { clearEntries, inProgress, completed } = this.props;
    const {
      expandedState,
      expandedIndex,
      isExpanded,
      autoScroll,
      hideEmpty,
      activeTab,
    } = this.state;
    const { toggleAutoscroll, toggleHideEmpty } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <div class="content">
          <h3 onclick=${() => this.setState({ isExpanded: !isExpanded })}>
            <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Renders
          </h3>

          ${isExpanded && html`
            <p>
              This panel shows you when a render occured and what was patched.
            </p>

            <div class="ui toggle checkbox">
              <input type="checkbox" ${autoScroll ? 'checked' : ''} onchange=${toggleAutoscroll} />
              <label>Autoscroll</label>
            </div>

            <div class="ui toggle checkbox" style="margin-left: 14px">
              <input type="checkbox" ${hideEmpty ? 'checked' : ''} onchange=${toggleHideEmpty} />
              <label>Hide empty renders</label>
            </div>

            <button class="ui basic button" style="margin-left: 14px" onclick=${clearEntries}>
              <i class="icon archive"></i> Clear
            </button>
          `}
        </div>
      </div>

      <div class="wrapper">
        ${expandedIndex === -1 && html`
          <div class="rows">
            <table class="header ui fixed celled sortable selectable structured table striped unstackable">
              <thead>
                <tr>
                  <th rowspan="2"></th>
                  <th class="center aligned" rowspan="2">Duration</th>
                  <th class="center aligned" rowspan="2">Status</th>
                  <th class="center aligned" rowspan="2">Mount</th>
                  <th class="center aligned" rowspan="2">Transitions</th>
                  <th class="center aligned" colspan="4">DOM Tree Changes</th>
                  <th class="center aligned" colspan="2">Attribute Changes</th>
                </tr>

                <tr>
                  <th class="center aligned">Insert</th>
                  <th class="center aligned">Replace</th>
                  <th class="center aligned">Remove</th>
                  <th class="center aligned">Node Value</th>
                  <th class="center aligned">Set Attribute</th>
                  <th class="center aligned">Remove Attribute</th>
                </tr>
              </thead>
            </table>

            <table class="ui fixed celled sortable selectable structured table striped unstackable">
              ${completed
                .sort(transaction => transaction.startDate)
                .filter(({ args }) => hideEmpty ? args.patches.length : true)
                .map((transaction, index) => html`
                  <devtools-transaction-row
                    key=${'completed-' + String(transaction.startDate)}
                    index=${index}
                    stateName="completed"
                    transaction=${transaction.args}
                    startTime=${transaction.startDate}
                    endTime=${transaction.endDate}
                    onClick=${this.toggleExpanded(completed, index)}
                  />
                `)}

              ${inProgress
                .sort(transaction => transaction.startDate)
                .map((transaction, index) => html`
                  <devtools-transaction-row
                    key=${'progress-' + String(transaction.startDate)}
                    index=${index}
                    stateName="progress"
                    transaction=${transaction.args}
                    startTime=${transaction.startDate}
                    endTime=${transaction.endDate}
                    onClick=${this.toggleExpanded(completed, index)}
                  />
                `)}

              ${(!completed.length && !inProgress.length) && html`
                <tbody>
                  <tr class="missing">
                    <td colspan="11">
                      No renders
                    </td>
                  </tr>
                </tbody>
              `}
            </table>
          </div>
        `}

        ${expandedIndex !== -1 && html`
          <transaction-detail transaction=${
            expandedState.sort(transaction => transaction.startDate)[expandedIndex]
          } />
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

      .ui.segment .content {
        flex: 1;
      }

      .ui.segment .controls {
        align-self: center;
      }

      .ui.table {
        border-left: 0;
        border-right: 0;
        font-size: 12px;
      }

      .wrapper {
        display: flex;
        font-size: 11px;
        overflow: hidden;
        height: 100%;
        flex-direction: column;
      }

      .wrapper > .rows {
        border: none;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
        width: 100%;
        padding-left: 0px;
      }

      h3 {
        cursor: pointer;
      }

      a {
        color: #4183C4;
        font-weight: bold !important;
        text-decoration: underline;
      }

      a:hover {
        color: #333;
        text-decoration: underline;
      }

      table {
        width: 1280px;
        border-top: 1px solid #B1B1B1;
        position: relative;
        top: -1px;
      }

      table.header {
        position: sticky;
        top: 0px;
        z-index: 1000;
        font-size: 12px !important;
        margin-bottom: 0 !important;
      }

      table.header + table {
        margin-top: 0 !important;
      }

      thead {
        position: sticky;
        top: -1px;
        z-index: 100;
        user-select: none;
      }

      .ui.table thead th {
        position: relative;
        border-radius: 0;
        border-color: #DEDEDE !important;
      }

      .ui.table thead tr:first-child>th:last-child {
        border-radius: 0;
        border-right: 0;
      }

      .ui.celled.table tr td:first-child, .ui.celled.table tr th:first-child {
        border-right: 0;
      }

      tbody tr td:first-child,
      thead tr th:first-child {
        border-left: 0;
      }

      thead th:nth-child(1) { width: 40px; }
      thead th:nth-child(2) { width: 80px; }
      thead th:nth-child(8) { border-right: 0; }

      tbody tr td:last-child {
        border-right: 0;
      }

      tr.missing {
        pointer-events: none;
        text-align: center;
      }
    `;
  }

  componentDidUpdate() {
    const { isExpanded, expandedIndex, autoScroll } = this.state;

    // TODO Have more intelligent locking for scrolling.
    if (expandedIndex === -1 && autoScroll) {
      const rows = this.shadowRoot.querySelector('.wrapper > .rows');

      if (rows) {
        rows.scrollTop = rows.scrollHeight;
      }
    }
  }

  toggleAutoscroll = () => {
    const autoScroll = !this.state.autoScroll;
    this.setState({ autoScroll });
  }

  toggleHideEmpty = () => {
    const hideEmpty = !this.state.hideEmpty;
    this.setState({ hideEmpty });
  }

  toggleExpanded(expandedState, index) {
    return () => {
      const expandedIndex = this.state.expandedIndex === index ? -1 : index;
      this.setState({ expandedState, expandedIndex });
    };
  }
}

customElements.define('devtools-transactions-panel', DevtoolsTransactionsPanel);
