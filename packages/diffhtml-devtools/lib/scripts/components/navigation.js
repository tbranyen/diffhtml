import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DevtoolsNavigation extends Component {
  static defaultProps = {
    activeRoute: '',
  }

  render() {
    const { activeRoute = '' } = this.props;
    const { nav } = this.state;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="navigation">
        <ol>
          ${nav.map((item, index) => html`
            <li index=${index} selected=${item.route === activeRoute.slice(1)} onclick=${() => this.onClick(index)}>
              <span class="label">
                ${item.icon && html`<i class="${item.icon} icon" />`}
                ${item.label}
                ${/*${item.subLabel && html`<span class="faded">${item.subLabel}</span>`}*/void 0}
              </span>
            </li>
          `)}
        </ol>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: flex;
        height: 100vh;
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
        margin-right: 10px;
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
        padding-bottom: 0;
      }

      .logo {
        position: relative;
        top: 4px;
        margin-right: 5px;
      }
    `;
  }

  state = {
    selected: 0,

    nav: [
      { route: '', label: 'Renders', icon: 'tasks' },
      { route: 'mounts', label: 'Mounts', icon: 'sitemap' },
      { route: 'middleware', label: 'Middleware', icon: 'chain' },
      { route: 'health', label: 'Health', icon: 'heartbeat' },
      { route: 'help', label: 'Help', icon: 'help' },
      //{ route: 'settings', label: 'Settings', icon: 'settings' },
    ],
  }

  /**
   * @param {typeof DevtoolsNavigation['defaultProps']} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.activeRoute) { return; }
    const route = nextProps.activeRoute.slice(1);
    const routes = this.state.nav.map(nav => nav.route);
    const selected = routes.indexOf(route);

    this.state.selected = selected;
  }

  /**
   * @param {number} index
   */
  onClick = index => {
    const { nav } = this.state;
    location.hash = nav[index].route;
  }
}

customElements.define('devtools-navigation', DevtoolsNavigation);
