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

  render() {
    const { inProgress = [], completed = [], inspect } = this.props;
    const { expandedIndex } = this.state;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Transactions</h3>
        <p>
          Logs out each internal render transaction. Set the sampling rate in
          <a href="#settings">Settings</a>.
        </p>
      </div>

      <div class="rows">
        <table class="ui celled sortable selectable structured table striped">
          <thead>
            <tr>
              <th rowspan="2"></th>
              <th class="center aligned" rowspan="2">FPS</th>
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

          ${completed.map((transaction, index) => html`
            <devtools-transaction-row
              key=${index}
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
        background: #AF8585;
        border-radius: 0 !important;
        color: #FFF;
        user-select: none;
      }

      a {
        color: #FFF;
        font-weight: bold !important;
        text-decoration: underline;
      }

      a:hover {
        color: #FFF;
        text-decoration: underline;
      }

      table {
        width: 1280px;
        border-top: 1px solid #B1B1B1;
        position: relative;
        top: -1px;
      }

      thead {
        position: sticky;
        top: -1px;
        background-color: #f3f3f3;
        z-index: 100;
        user-select: none;
      }

      thead th {
        position: relative;
      }

      thead th:before {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border: 1px solid #B1B1B1;
      }

      thead th:first-child:before {
        border-left: none;
      }

      thead th:last-child:before {
        border-right: none;
      }

      tr.missing {
        pointer-events: none;
        text-align: center;
      }
    `;
  }

  constructor() {
    super();

    this.state = { expandedIndex: -1, autoScroll: true };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  componentDidUpdate() {
    const { expandedIndex, autoScroll } = this.state;

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
