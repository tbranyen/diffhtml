import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsNavigation extends WebComponent {
  static propTypes = {
    version: PropTypes.string,
    activeRoute: PropTypes.string,
  }

  render() {
    const { version } = this.props;
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
          <strong>Detected diffHTML: ${version}</strong>
          <hr>
          Created by <a target="_blank" href="http://twitter.com/tbranyen">@tbranyen</a>
        </div>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: flex;
        height: 100%;
        flex-basis: 200px;
        flex: none;
        background-color: #222;
        color: #FEFEFE;
        border: 0;
        border-right: 1px solid rgb(76, 76, 76);
        box-sizing: border-box;
        user-select: none;
        overflow-y: auto;
      }

      hr {
        border: none;
        border-bottom: 1px solid rgb(76, 76, 76);
      }

      ol {
        margin: 0;
        list-style: none;
        padding: 0;
        width: 100%;
      }

      ol li {
        width: 100%;
        height: 40px;
        padding: 20px;
        box-sizing: border-box;
        color: #bdbdbd;
        line-height: 2px;
        cursor: pointer;
        margin-bottom: 0;
        transition: color cubic-bezier(.17,.67,.83,.67) 140ms;
      }

      ol li span.label i {
        color: #737373;
        left: -7px;
      }

      ol li:hover {
        color: #FEFEFE;
      }

      ol li:hover i.icon {
        color: #FEFEFE;
      }

      ol li[selected='true']:hover {
        font-weight: inherit;
      }

      ol li[selected='true'] {
        background-color: #25272b;
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
        font-size: 11px;
        padding: 25px;
      }
    `;
  }

  state = {
    selected: 0,

    nav: [
      { route: '', label: 'Renders', icon: 'tasks' },
      { route: 'mounts', label: 'Elements', icon: 'sitemap' },
      { route: 'middleware', label: 'Middleware', icon: 'chain' },
      { route: 'health', label: 'Health', icon: 'heartbeat' },
      { route: 'settings', label: 'Settings', icon: 'settings' },
      //{ route: 'help', label: 'Help', icon: 'help' },
    ],
  }

  componentWillReceiveProps(nextProps) {
    const route = location.hash.slice(1);
    const routes = this.state.nav.map(nav => nav.route);
    const selected = routes.indexOf(route);

    this.state.selected = selected;
  }

  onClick = selected => {
    const { nav } = this.state;
    location.hash = nav[selected].route;
  }
}

customElements.define('devtools-navigation', DevtoolsNavigation);
