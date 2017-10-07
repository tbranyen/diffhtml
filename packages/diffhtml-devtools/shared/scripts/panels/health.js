import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';

class DevtoolsHealthPanel extends WebComponent {
  static propTypes = {
    activeRoute: PropTypes.string,
    memory: PropTypes.array,
  }

  render() {
    const { memory } = this.props;

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
        <h3>Health</h3>
      </div>

      <div class="ui styled fluid accordion">
        <h3>Object Pools</h3>

        <${ChartistGraph}
          type="Line"
          data=${{ labels, series }}
          options=${{
            low: 0,
            high: 10000,
            showArea: true,
            showPoint: false,
            fullWidth: true,
            height: '200px',
          }}
        />
      </div>
    `;
  }

  styles() {
    return `
      @import '/node_modules/chartist/dist/chartist.min.css';

      :host {
        display: block;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: #3E82F7;
        border-radius: 0 !important;
        color: #FFF;
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
