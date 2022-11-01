import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

const slideIn = async (parent, child) => {
  if (parent !== child) {
    return;
  }

  const el = parent;

  el.style.opacity = 0;
  el.style.height = '100%';

  await new Promise(resolve => setTimeout(resolve, 100));

  el.style.opacity = 0.1;

  const frames = [
    { opacity: 0.1, transform: 'translateY(100%)' },
    { opacity: 1, transform: 'translateY(0%)' },
  ];

  await el.animate(frames, { duration: 100 }).finished;

  el.style.opacity = 1;
  el.style.height = '100%';
};

const slideOut = dir => el => el.animate([
  { transform: 'translateY(0%)' },
  { transform: `translateY(${dir === 'up' ? '-' : ''}100%)` },
], { duration: 140 }).finished;

class DevtoolsTransactionsPanel extends Component {
  static defaultProps = {
    inProgress: [],
    completed: [],
    inspect: () => {},
    activeRoute: '',
  }

  state = {
    isExpanded: false,
    activeTransaction: null,
    autoScroll: true,
    hideEmpty: false,
    maxSorted: 20,
    sortBy: 'startDate',
    sortDir: 'desc',
    sorted: [],
  }

  render() {
    const { clearEntries } = this.props;
    const {
      isExpanded,
      autoScroll,
      hideEmpty,
      activeTransaction,
      sorted,
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
              You can use this view to see TTR (Time to Render), the mounted
              DOM Node, and most importantly the deltas between the previous
              render.
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
        <div class="rows" ${Boolean(activeTransaction) && ({ style: 'flex: 0' })}>
          <table class="header ui fixed celled sortable selectable structured table striped unstackable">
            <thead>
              <tr>
                <th rowspan="2"></th>
                <th class="center aligned" rowspan="2">TTR</th>
                <th class="center aligned" rowspan="2">Status</th>
                <th class="center aligned" rowspan="2">Mount</th>
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

          <table class="transaction-list ui fixed celled sortable selectable structured table striped unstackable">
            ${sorted.length && sorted.map((transaction, index) => html`
              <devtools-transaction-row
                class="ui ${transaction === activeTransaction && 'active'}"
                key=${(transaction.endDate ? 'completed-' : 'progress-') + transaction.startDate}
                index=${index}
                stateName=${(transaction.endDate ? 'completed' : 'progress')}
                transaction=${transaction.args}
                startTime=${transaction.startDate}
                endTime=${transaction.endDate}
                onClick=${transaction.endDate && this.toggleExpanded(transaction)}
              />
            `)}

            ${!sorted.length && html`
              <tbody>
                <tr class="missing">
                  <td colspan="10">
                    No renders
                  </td>
                </tr>
              </tbody>
            `}
          </table>
        </div>

        ${Boolean(activeTransaction) && html`
          <devtools-transaction-detail
            onattached=${slideIn}
            ondetached=${slideOut('down')}
            class="ui"
            transaction=${activeTransaction}
            closeDetail=${this.toggleExpanded(null)}
          />
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

  constructor(...args) {
    super(...args);

    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps, nextState = this.state) {
    const { hideEmpty, sortBy, maxSorted, sortDir, activeTransaction } = nextState;

    //if (nextProps.inProgress) {
    //  this.state.sorted = nextProps.inProgress
    //    .sort((a, b) => sortDir === 'asc' ? a[sortBy] < b[sortBy] : a[sortBy] > b[sortBy]);
    //}

    if (nextProps.completed) {
      this.state.sorted = nextProps.completed
        .sort((a, b) => sortDir === 'asc' ? a[sortBy] < b[sortBy] : a[sortBy] > b[sortBy])
        .filter(({ args }) => hideEmpty ? args.patches.length : true);
    }

    // TODO determine if this is necessary
    // Only use up to 50 items.
    this.state.sorted = this.state.sorted.reverse();

    // Reset activeTransaction if it's no longer relevant.
    if (activeTransaction && !this.state.sorted.includes(activeTransaction)) {
      this.state.activeTransaction = null;
    }
  }

  componentDidUpdate() {
    const { expandedIndex, autoScroll } = this.state;

    // TODO Have more intelligent locking for scrolling.
    if (expandedIndex === -1 && autoScroll) {
      const rows = this.shadowRoot.querySelector('.wrapper > .rows');

      if (rows) {
        rows.scrollTop = rows.scrollHeight;
      }
    }
  }

  shouldComponentUpdate() {
    const { activeRoute } = this.props;

    return activeRoute === '#transactions' || !activeRoute;
  }

  toggleAutoscroll = () => {
    this.setState({ autoScroll: !this.state.autoScroll });
  }

  toggleHideEmpty = () => {
    this.setState({ hideEmpty: !this.state.hideEmpty });
  }

  toggleExpanded = activeTransaction => () => {
    this.setState({ activeTransaction });
  }
}

customElements.define('devtools-transactions-panel', DevtoolsTransactionsPanel);
