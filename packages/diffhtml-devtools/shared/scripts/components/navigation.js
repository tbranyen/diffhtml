import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsNavigation extends WebComponent {
  static propTypes = {
    activeRoute: PropTypes.string,
  }

  render() {
    const { nav, selected } = this.state;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="navigation">
        <ol>
          ${nav.map((item, index) => html`
            <li index=${index} selected=${selected === index} onclick=${() => this.onClick(index)}>
              <span class="label">
                ${item.icon && html`<i class="${item.icon} icon" />`}
                ${item.label}
                ${item.subLabel && html`<span class="faded">${item.subLabel}</span>`}
              </span>
            </li>
          `)}
        </ol>

        <div class="credit">
          Created by
          <p>
            <a target="_blank" href="http://twitter.com/tbranyen">@tbranyen</a>
          </p>
        </div>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: flex;
        height: calc(100% - 37px);
        flex-basis: 200px;
        flex: none;
        background-color: #F3F3F3;
        border: 0;
        border-right: 1px solid rgb(64%, 64%, 64%);
        box-sizing: border-box;
        user-select: none;
        overflow-y: auto;
      }

      ol {
        margin: 0;
        list-style: none;
        padding: 0;
        width: 250px;
      }

      ol li {
        width: 100%;
        height: 40px;
        background-color: #DDDDDD;
        padding: 20px;
        box-sizing: border-box;
        color: #333;
        line-height: 2px;
        cursor: pointer;
        margin-bottom: 0;
      }

      ol li span.label i {
        color: #AF8585;
        left: -7px;
      }

      ol li:hover {
        background-color: #B4B4B4;
      }

      ol li[selected='true'] {
        background-color: #737373;
        color: #FFF;
      }

      ol li:first-child span.label i {
        left: -4px;
      }

      ol li[selected='true'] span.label i {
        color: #FFF;
      }

      i.icon {
        font-size: 30px;
      }

      span.faded {
        color: #757575;
      }

      span.label {
        position: relative;
        top: -8px;
      }

      span.label i {
        transform: scale(0.6,0.6);
      }

      div.credit {
        font-size: 10px;
        padding: 25px;
      }
    `;
  }

  constructor() {
    super();

    this.state = {
      selected: 0,

      nav: [
        { route: '', label: 'Transactions', icon: 'exchange' },
        { route: 'mounts', label: 'Mounts', icon: 'sitemap' },
        { route: 'middleware', label: 'Middleware', icon: 'chain' },
        { route: 'resources', label: 'Health', icon: 'heartbeat' },
        { route: 'help', label: 'Help', icon: 'help' },
        { route: 'settings', label: 'Settings', icon: 'settings' },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const route = location.hash.slice(1);
    const routes = this.state.nav.map(nav => nav.route);
    const selected = routes.indexOf(route);

    this.setState({ selected });
  }

  onClick = selected => {
    const { nav } = this.state;
    location.hash = nav[selected].route;
  }
}

customElements.define('devtools-navigation', DevtoolsNavigation);
