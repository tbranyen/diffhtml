import { html, Internals } from 'diffhtml';
import { Component } from 'diffhtml-components';
import SemanticUITable from '../semantic-ui/table';

const { keys } = Object;

class DevtoolsTransactionRow extends Component {
  static propTypes = {
    index: Number,
    transaction: Object,
    stateName: String,
    startTime: Number,
    endTime: Number,
  }

  render() {
    const { getColorFromStat } = this;
    const {
      startTime,
      endTime,
      transaction,
      stateName,
    } = this.props;

    const stats = this.calculateStats();

    const {
      domNode = '',
      aborted = false,
      promises = [],
    } = transaction;

    let unnecessaryRender = true;

    keys(stats).some(statName => {
      if (stats[statName]) {
        unnecessaryRender = false;
        return true;
      }
    });

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <td class="ui center aligned">
        ${unnecessaryRender && transaction.completed && html`
          <div
            data-tooltip="Unnecessary render, nothing changed"
            data-position="top left"
          >
            <i class="icon warning sign yellow" />
          </div>
        `}
      </td>

      <td class="ui center aligned">
        <span>${endTime ? `${(endTime - startTime).toFixed(1)}ms` : ''}</span>
      </td>

      <td class="ui center aligned">
        <span>
          ${aborted ? 'Aborted' : (
            stateName === 'completed' ? 'Completed' : 'In Progress'
          )}
        </span>
      </td>

      <td class="ui center aligned">
        <div class="node">
          &lt;${domNode}&gt;
        </div>
      </td>

      <td class="ui center aligned">
        <strong><a>${String(promises.length)}</a></strong>
      </td>

      <td class="ui center aligned ${getColorFromStat(stats.insert)}">
        <strong><a>${stats.insert}</a></strong>
      </td>

      <td class="ui center aligned ${getColorFromStat(stats.replace)}">
        <strong><a>${stats.replace}</a></strong>
      </td>

      <td class="ui center aligned ${getColorFromStat(stats.remove)}">
        <strong><a>${stats.remove}</a></strong>
      </td>

      <td class="ui center aligned ${getColorFromStat(stats.nodeValue)}">
        <strong><a>${stats.nodeValue}</a></strong>
      </td>

      <td class="ui center aligned ${getColorFromStat(stats.setAttribute)}">
        <strong><a>${stats.setAttribute}</a></strong>
      </td>

      <td class="ui center aligned ${getColorFromStat(stats.removeAttribute)}">
        <strong><a>${stats.removeAttribute}</a></strong>
      </td>
    `;
  }

  shouldComponentUpdate(nextProps) {
    if (this._lastStateName !== nextProps.stateName) {
      this._lastStateName = nextProps.stateName;
      return true;
    }

    return false;
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

      .inverted .node {
        color: #D35263;
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
        border-color: #DEDEDE;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      td.inverted {
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      td:nth-of-type(1) {
        overflow: visible;
      }

      td > * {
        width: 100%;
        display: inline-block;
      }

      td:nth-of-type(1) { width: 40px; border-left: 0; }
      td:nth-of-type(2) { width: 80px; }
      td:nth-of-type(11) { border-right: 0; }

      :host(:hover) td.inverted {
        background-color: #FBCA82;
      }

      :host(.active) td.inverted {
        background-color: #82FBD9;
      }

      :host(:hover) td, :host(.active) td {
        background-color: #FFF4D3;
        /*background-color: #e0d6ba;*/
        color: #333;
        cursor: pointer;
      }

      :host(:hover) td.red {
        background-color: #FFF4D3;
        color: #F1B1B1 !important;
      }

      :host(:hover) td.yellow {
        background-color: #FFF4D3;
        color: #FFEBA0 !important;
      }

      :host(:hover) td.green {
        background-color: #FFF4D3;
        color: #b8efc5 !important;
      }

      td.red:not(.inverted) { background-color: #F1B1B1 !important; }
      td.red a { color: #772E2E; }
      :host(:hover) td.red.inverted, :host(.active) td.red.inverted {
        color: #F95454 !important;
      }

      td.yellow:not(.inverted) { background-color: #FFEBA0 !important; }
      td.yellow a { color: #EF7C11; }

      td.green:not(.inverted) { background-color: #A5DEA5 !important; }
      td.green.inverted { background-color: #89E889 !important; }
      :host(:hover) td.green.inverted, :host(.active) td.green.inverted {
        color: #22ff84 !important;
      }
      td.green a { color: #009407; }
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
