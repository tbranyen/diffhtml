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
    autoScroll: true,
  }

  render() {
    const { inspect, clearEntries, inProgress, completed } = this.props;
    const { expandedIndex, isExpanded } = this.state;

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
              Set the sampling rate in <a href="#settings">Settings</a>.
            </p>

            <div class="ui toggle checkbox">
              <input type="checkbox" />
              <label>Autoscroll</label>
            </div>

            <div class="ui toggle checkbox" style="margin-left: 14px">
              <input type="checkbox" />
              <label>Hide empty renders</label>
            </div>

            <button class="ui basic button" style="margin-left: 14px" onclick=${clearEntries}>
              <i class="icon archive"></i> Clear
            </button>
          `}
        </div>
      </div>

      <div class="rows">
        <table class="header ui fixed celled sortable selectable structured table striped">
          <thead>
            <tr>
              <th rowspan="2"></th>
              <th class="center aligned" rowspan="2">FPS</th>
              <th class="center aligned" rowspan="2">Time</th>
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

        <table class="ui fixed celled sortable selectable structured table striped">
          ${completed
            .sort(transaction => {
              return transaction.startDate;
            })
            .map((transaction, index) => html`
              <devtools-transaction-row
                key=${'completed-' + String(transaction.startDate)}
                index=${index}
                stateName="completed"
                transaction=${transaction.args}
                startTime=${transaction.startDate}
                endTime=${transaction.endDate}
                isExpanded=${expandedIndex === index}
                inspect=${inspect}
                onclick=${this.toggleExpanded}
              />
            `)}

          ${!completed.length && html`
            <tbody>
              <tr class="missing">
                <td colspan="13">
                  No transactions
                </td>
              </tr>
            </tbody>
          `}
        </table>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
        height: 1;
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
        background: #FFF;
        color: #333;
        border-radius: 0 !important;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
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

      thead th {
        position: relative;
        border-radius: 0;
      }

      .ui.table thead tr:first-child>th:last-child {
        border-radius: 0;
      }

      .ui.celled.table tr td:first-child, .ui.celled.table tr th:first-child {
        border-right: none;
      }

      tbody tr td:first-child,
      thead tr th:first-child {
        border-left: none;
      }

      tbody tr td:last-child,
      thead tr th:last-child {
        border-right: none;
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
    const { expandedIndex, autoScroll } = this.state;

    // TODO Have more intelligent locking for scrolling.
    if (expandedIndex === -1 && autoScroll) {
      this.parentNode.scrollTop = this.parentNode.scrollHeight;
    }
  }

  toggleExpanded(index) {
    const expandedIndex = this.state.expandedIndex === index ? -1 : index;
    this.setState({ autoScroll: false, expandedIndex });
  }
}

customElements.define('devtools-transactions-panel', DevtoolsTransactionsPanel);
