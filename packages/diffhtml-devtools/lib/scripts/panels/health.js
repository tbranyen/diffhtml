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
    activeTab: 'memory',
  }

  render() {
    const { memory = [] } = this.props;
    const { isExpanded, activeTab } = this.state;
    const { setActive } = this;

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

        ${isExpanded && html`
          <p>
            Displays the active memory usage. Will allow you to toggle the
            profiler and view a visualization of the rendering flow.
          </p>
        `}
      </div>

      <div class="wrapper">
        <div class="ui attached tabular menu">
          <div class="ui item ${activeTab === 'memory' && 'active'}">
            <a href="#" onClick=${setActive('memory')}>Memory</a>
          </div>

          <div class="ui item ${activeTab === 'profiler' && 'active'}">
            <a href="#" onClick=${setActive('profiler')}>Profiler</a>
          </div>
        </div>

        <div class="ui bottom attached tab segment ${activeTab === 'memory' && 'active'}">
          <div class="ui segment">
            <div class="ui two column very relaxed grid">
              <div class="ui column">
                <p style="margin-left: 20px; margin-top: 20px; margin-bottom: 20px">
                  ${series.map((count, i) => html`
                    ${i === 0 && html`
                      <strong>${String(count)} free</strong>
                    `}

                    ${i === 2 && html`
                      <strong style="margin-left: 5px; padding: 4px; color: #4A8209; background: #BFFB86">
                        ${String(count)} used
                      </strong>
                    `}
                  `)}
                </p>

                <svg
                  height="20"
                  width="20"
                  viewBox="0 0 20 20"
                  style=${{
                    zoom: 6,
                    marginLeft: '2px',
                  }}
                >
                  ${series.map((count, i) => html`
                    <!-- Free -->
                    ${i === 0 && html`
                      <circle r="10" cx="10" cy="10" fill="#2185D0" />
                    `}

                    <!-- Protected -->
                    ${i === 2 && html`
                      <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke="#BFFB86"
                        stroke-width="10"
                        stroke-dasharray="calc(${(series[2][0] / series[0][0]) * 100} * 31.4 / 100) 31.4"
                        transform="rotate(-90) translate(-20)"
                      />
                    `}
                  `)}
                </svg>
              </div>

              <div class="ui column" style="align-self: center">
                <button class="ui button">Trigger GC</button>
              </div>
            </div>

            <div class="ui vertical divider">
              <i class="icon cogs" />
            </div>
          </div>
        </div>

        <div class="ui bottom attached tab segment ${activeTab === 'profiler' && 'active'}">
          <div class="ui top attached menu">
            <div class="ui dropdown icon item" tabindex="0">
              <i class="circle icon"></i>
            </div>

            <div class="ui right menu">
            </div>
          </div>
        </div>
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
        box-sizing: border-box;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        font-size: 11px;
        overflow: hidden;
        height: 100%;
      }

      h3 {
        cursor: pointer;
      }

      .ui.column {
        text-align: center;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        margin-bottom: 0;
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

      .ui.attached {
        margin: 0px 10px !important;
        border-top: 0 !important;
      }

      .ui.menu {
        margin: 0 !important;
        padding: 0 !important;
      }

      .ui.bottom {
        margin: 0 !important;
        box-sizing: border-box !important;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }

  triggerGC = name => () => {
    const type = 'gc';

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, {
        type,
        name,
      }));
    });
  }

}

customElements.define('devtools-health-panel', DevtoolsHealthPanel);
