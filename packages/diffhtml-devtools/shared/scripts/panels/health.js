import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';
//import Chartist from 'chartist';
//import ChartistGraph from 'react-chartist';

class DevtoolsHealthPanel extends WebComponent {
  static propTypes = {
    activeRoute: PropTypes.string,
    memory: PropTypes.array,
  }

  state = {
    isExpanded: false,
  }

  render() {
    const { memory = [] } = this.props;
    const { isExpanded } = this.state;

    const labels = memory.map(mem => new Date(mem.time).toLocaleTimeString());

    const series = [
      memory.map(mem => mem.free),
      memory.map(mem => mem.allocated),
      memory.map(mem => mem.protected),
    ];

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3 onclick=${() => this.setState({ isExpanded: !isExpanded })}>
          <i style="position: relative; top: -2px" class="icon chevron ${isExpanded ? 'up' : 'down'}"></i> Health
        </h3>
      </div>

      <div class="ui styled fluid accordion">
        <h3>Object Pools</h3>

        <ul>
          ${series.map((count, i) => html`
            <li>
              ${i === 0 ? `Free: ${count}` : ''}
              ${i === 1 ? `Allocated: ${count}` : ''}
              ${i === 2 ? `Protected: ${count}` : ''}
            </li>
          `)}
        </ul>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      h3 {
        cursor: pointer;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: #FFF;
        color: #333;
        border-radius: 0 !important;
        user-select: none;
      }

      .ui.accordion {
        box-shadow: none !important;
      }

      .ui.accordion h3 {
        padding: 14px;
      }
    `;
  }
}

customElements.define('devtools-health-panel', DevtoolsHealthPanel);
