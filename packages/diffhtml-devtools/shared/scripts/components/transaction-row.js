import { html, Internals } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';
import SemanticUITable from '../semantic-ui/table';

const { keys } = Object;

class DevtoolsTransactionRow extends WebComponent {
  static propTypes = {
    index: PropTypes.number,
    transaction: PropTypes.object,
    stateName: PropTypes.string,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
  }

  render() {
    const { getColorFromStat } = this;
    const {
      startTime,
      endTime,
      index,
      transaction,
      stateName,
    } = this.props;

    const stats = this.calculateStats();

    const {
      domNode = '',
      markup = {},
      aborted = false,
      promises = [],
      surpressedCount,
    } = transaction;

    let unnecessaryRender = true;

    keys(stats).some(statName => {
      if (stats[statName]) {
        unnecessaryRender = false;
        return true;
      }
    });

    const fps = endTime ? 1000 / (endTime - startTime) : Infinity;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <td class="center aligned">
        ${surpressedCount}
        ${unnecessaryRender && transaction.completed && html`
          <div
            data-tooltip="Nothing changed, unnecessary render!"
            data-position="right center"
          >
            <i class="icon warning sign yellow" />
          </div>
        `}
      </td>

      <td class="center aligned">
        <span>${endTime ? `${(endTime - startTime).toFixed(1)}ms` : ''}</span>
      </td>

      <td class="center aligned">
        <span>
          ${aborted ? 'Aborted' : (
            stateName === 'completed' ? 'Completed' : 'In Progress'
          )}
        </span>
      </td>

      <td class="center aligned">
        <div class="node">
          &lt;${domNode}&gt;
        </div>
      </td>

      <td class="center aligned">
        <strong><a>${String(promises.length)}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.insert)}">
        <strong><a>${stats.insert}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.replace)}">
        <strong><a>${stats.replace}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.remove)}">
        <strong><a>${stats.remove}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.nodeValue)}">
        <strong><a>${stats.nodeValue}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.setAttribute)}">
        <strong><a>${stats.setAttribute}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.removeAttribute)}">
        <strong><a>${stats.removeAttribute}</a></strong>
      </td>

      ${false && html`
        <div>
          <h3>Transaction #${index + 1} Summary</h3>
          <p>Was aborted? ${String(aborted)}</p>
        </div>
      `}
    `;

  }

  styles() {
    return `
      ${SemanticUITable}

      :host {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        user-select: none;
      }

      .transaction-row {
        padding-left: 20px;
        height: 46px;
        line-height: 46px;
        background-color: #e9f9e9;
        border-bottom: 1px dotted #a3a3a3;
        color: #003f0c;
        font-weight: bold;
        cursor: pointer;
      }

      .transaction-expanded {
        border-bottom: 2px solid #61b563;
        padding: 20px;
      }

      h3 {
        margin-top: 0;
      }

      i.icon.warning.sign {
        background-color: transparent;
      }

      .node {
        color: #91248A;
        font-family: "dejavu sans mono", monospace;
        font-size: 11px;
      }

      .center.aligned {
        text-align: center;
      }

      td {
        padding: 10px;
        text-align: center;
      }

      td > * {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        display: inline-block;
      }

      td:nth-of-type(1) { width: 40px; border-left: 0; }
      td:nth-of-type(2) { width: 80px; }
      td:nth-of-type(13) { border-right: 0; }

      :host(:hover) td {
        background-color: #FFF4D3;
        color: #333;
        cursor: pointer;
      }
      :host(:hover) td.red { background-color: #F1B1B1 !important; }
      :host(:hover) td.red a { color: #772E2E !important; }
      :host(:hover) td.yellow { background-color: #FFEBA0 !important; }
      :host(:hover) td.yellow a { color: #EF7C11 !important; }
      :host(:hover) td.green { background-color: #b8efc5 !important; }

      .red { background-color: #F1B1B1; }
      .red a { color: #772E2E; }

      .yellow { background-color: #FFEBA0; }
      .yellow a { color: #EF7C11; }

      .green { background-color: #A5DEA5; }
      .green a { color: #009407; }
    `;
  }

  calculateStats() {
    const { transaction } = this.props;
    const stats = {
      insert: 0,
      replace: 0,
      remove: 0,
      nodeValue: 0,
      setAttribute: 0,
      removeAttribute: 0,
    };

    if (!transaction || !transaction.patches) {
      return stats;
    }

    const { patches } = transaction;
    const { length } = patches;
    const { PATCH_TYPE } = Internals;

    let i = 0;

    while (true) {
      const patchType = patches[i];

      if (i === length) {
        break;
      }

      switch(patchType) {
        case PATCH_TYPE.SET_ATTRIBUTE: {
          stats.setAttribute += 1;

          i += 4;
          break;
        }

        case PATCH_TYPE.REMOVE_ATTRIBUTE: {
          stats.removeAttribute += 1;

          i += 3;
          break;
        }

        case PATCH_TYPE.NODE_VALUE: {
          stats.nodeValue += 1;

          i += 4;
          break;
        }

        case PATCH_TYPE.INSERT_BEFORE: {
          stats.insert += 1;

          i += 4;
          break;
        }

        case PATCH_TYPE.REPLACE_CHILD: {
          stats.replace += 1;

          i += 3;
          break;
        }

        case PATCH_TYPE.REMOVE_CHILD: {
          stats.remove += 1;

          i += 2;
          break;
        }
      }
    }

    return stats;
  }

  getColorFromStat = number => {
    let color = '';

    if (number > 100) {
      color = 'red';
    }
    else if (number > 50) {
      color = 'yellow';
    }
    else if (number > 0) {
      color = 'green';
    }

    return color;
  }
}

customElements.define('devtools-transaction-row', DevtoolsTransactionRow);
