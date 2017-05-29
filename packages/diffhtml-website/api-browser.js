import { use, html, innerHTML, createElement } from 'diffhtml';
import Component from 'diffhtml-components/lib/component';
import 'proxy-polyfill/proxy.min';
import 'whatwg-fetch';

const { highlightAuto } = hljs;
const $$render = Symbol.for('diff.render');

class ApiBrowser extends Component {
  render() {
    return this.state.latestStable ? html`
      Stable is ${this.state.latestStable}

      <select onchange=${this.switchVersion.bind(this)}>
        ${this.state.refs.map((ref, i) => html`<option
          data-ref="${encodeURIComponent(ref)}"
          ${ref === this.state.ref ? 'selected' : ''}
        >
          ${this.prettyPrint(ref, i)}
        </option>`)}
      </select>

      <p>
        All of the following methods are available under the <code>diff</code>
        namespace and you can alternatively import them individually using
        CommonJS or ES-2015 modules. The examples shown use the ES-2015 modules
        format. If you want to use this format as well, you'll need a
        transpiler like <a href="https://babeljs.io/">Babel</a>.
      </p>

      <hr>

      <ul class="methods">
        ${this.state.comments.map(comment => html`<li>
          <a href="#${comment.ctx.name}">${comment.ctx.name}<strong class="args">(${this.makeArgs(comment.tags.filter(tag => tag.type === 'param'))})</strong></a>
        </li>`)}
      </ul>

      <hr>

      <section class="comments">
        ${this.state.comments.map(comment => {
          const ref = this.state.ref.split('/').slice(-1)[0];
          const url = `${this.state.url}/blob/${ref}/lib/index.js#L${comment.codeStart}`;
          const returnValue = comment.tags.filter(tag => tag.type === 'return');
          const examples = comment.tags.filter(tag => tag.type === 'example');
          const params = comment.tags.filter(tag => tag.type === 'param');

          return html`
            <div class="comment">
              <a class="header" id="${comment.ctx.name}" href="#${comment.ctx.name}"><h4 class="api-method">${comment.ctx.name}<strong class="args">(${this.makeArgs(params)})</strong></h4></a>

              <p class="push-left">
                <a class="methods" href="#api">&nbsp; Back to API</a> |
                <a class="view-on-github" href="${url}">
                  <i class="fa fa-github" aria-hidden="true"></i> View source on GitHub
                </a>
              </p>

              <div>
                ${this.strip('br', comment.description.full)}
              </div>

              <h5>${examples.length > 1 ? 'Examples' : 'Example'}</h5>

              ${examples.length ? examples.map(tag => html`
                <pre><code class="javascript hljs">
                  ${html(highlightAuto(this.trimCode(tag.string), ['javascript']).value)}
                </code></pre>
              `) : `No examples`}

              <h5>Arguments</h5>

              ${params.length ? html`
                <table class="details">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Default value</th>
                      <th>Required</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${params.map(tag => html`<tr>
                      <td class="strong">${this.getName(tag.name)}</td>
                      <td>${tag.description ? html(tag.description) : 'n/a'}</td>
                      <td><code>${this.getDefault(tag.name)}</code></td>
                      <td>${String(!tag.optional)}</td>
                    </tr>`)}
                  </tbody>
                </table>
              ` : html`
                No arguments to display
              `}

              <h5>Return value</h5>

              ${returnValue.length ? html`<p>
                ${returnValue[0].string}
              </p>` : html('<code>undefined</code>')}

              <div class="gap"></div>
              <hr>
            </div>
          `;
        })}
        </section>
    ` : html`
      No API data loaded.
    `;
  }

  constructor() {
    super();

    const debounce = () => {
      clearTimeout(debounce.timeout);
      debounce.timeout = setTimeout(() => this[$$render](), 10);
    };

    const bindState = { get(o, k) { return o[k]; }, set(o, k, v) { o[k] = v; return !debounce(); } };

    this.state = new Proxy({
      url: 'http://github.com/tbranyen/diffhtml',
      isFetching: false,
      ref: null,
      refs: null,
      comments: null,
      latestStable: null,
      output: null,
      repo: null,
      version: null,
    }, bindState);

    const ref = location.pathname.slice(1);

    if (ref) {
      this.state.ref = ref;
    }

    this.state.isFetching = false;

    this.request = this.fetch(ref).then(() => {
      if (!ref) {
        this.state.ref = this.state.refs[1];
      }
      this.state.isFetching = false;
    });
  }

  trimCode(src) {
    const whitespaceRegex = /(\s+).*/;
    const match = whitespaceRegex.exec(src);

    if (match) {
      const length = match[1].length;
      const leading = new RegExp(Array(length).fill('').join(' '), 'g');
      return src.replace(leading, '');
    }

    return src;
  }

  makeArgs(params) {
    return params.map(param => {
      return param.optional ? `[${param.name}]` : param.name;
    }).join(', ');
  }

  switchVersion(ev) {
    const option = ev.target.children[ev.target.selectedIndex];
    this.state.ref = option.dataset.ref;
    this.fetch(option.dataset.ref);
    location.href = '/' + option.dataset.ref + '#api';
  }

  getName(name='') {
    return name.split('=')[0];
  }

  getDefault(name='') {
    const parts = name.split('=');

    return parts.length > 1 ? parts[1] : 'undefined';
  }

  strip(tagName, contents) {
    let tree = html(contents);

    const filter = childNodes => {
      return childNodes.map(childNode => {
        if (childNode.nodeName === tagName) {
          return createElement('#text', null, ' ');
        }

        childNode.childNodes = filter(childNode.childNodes);

        return childNode;
      });
    };

    if (tree.childNodes) {
      tree.childNodes = filter(tree.childNodes);
    }

    if (Array.isArray(tree)) {
      tree = filter(tree);
    }

    return tree;
  }

  prettyPrint(ref, count) {
    if (ref.indexOf('refs/heads') > -1) {
      return `${ref.slice('refs/heads/'.length)} (unstable) branch`;
    }
    else if (ref.indexOf('refs/tags') > -1) {
      if (count === 1) {
        return `v${ref.slice('refs/tags/'.length)} (stable) tag`;
      }
      else {
        return `v${ref.slice('refs/tags/'.length)} (outdated) tag`;
      }
    }
    else if (ref.indexOf('refs/remotes') > -1) {
      return `${ref.slice('refs/remotes/'.length)} remote branch`;
    }
  }

  fetch(version) {
    const request = fetch(`/api/${version ? version : ''}`);
    const parseJSON = request.then(resp => resp.json());

    return parseJSON.then(state => Object.assign(this.state, state));
  }
}

const browser = new ApiBrowser();
let sem = 0;

use(() => () => {
  console.log('afterRender');
  sem++;

  if (sem !== 2) {
    return;
  }

  const setTarget = selector => {
    const target = document.querySelector(`a[href='${selector}']`);

    if (target) {
      [...document.querySelectorAll('.target')].forEach(el => el.classList.remove('target'));
      target.classList.add('target');

      const link = document.querySelector(selector);

      if (link) {
        link.scrollIntoView(true);
      }
    }
  };

  const hash = location.hash;

  // This is due to the lack of server-side rendering for API docs. This should
  // be rectified.
  setTimeout(() => setTarget(hash), 100);

  let scrollTop = document.body.scrollTop;

  // Set up the anchor monitoring.
  let timeout = null;

  // Get all the headers in `section#content`.
  let nodes =  document.querySelectorAll(`${
    ['h1','h2','h3','h4','h5', 'a[id].header'].map(selector => `
      section#content ${selector}
    `).join(', ').trim()
  }`.trim());

  // Make up a table full of offsets.
  let headerTable = [...nodes].map(el => {
    const top = el.getBoundingClientRect().top + scrollTop;
    const selector = `#${el.id}`;
    const anchor = document.querySelector(`nav a[href='${selector}']`);
    return { el, top, anchor, };
  }).slice(1).filter(meta => meta.anchor);

  const clearAll = () => {
    headerTable.forEach(meta => meta.anchor.classList.remove('target'));
  };

  const update = () => {
    // Bring back some of the padding, so we can see the section title...
    scrollTop = document.body.scrollTop + 60;

    headerTable.sort((a, b) => b.top - a.top).some(meta => {
      if (scrollTop > meta.top) {
        clearAll();

        if (scrollTop) {
          meta.anchor.classList.add('target');
          history.replaceState('', {}, meta.anchor.href);
        }
        else {
          history.replaceState('', {}, '/');
        }

        return true;
      }
    });
  };

  let delay = true;

  // Initial page delay.
  setTimeout(() => { delay = false; }, 100);

  const monitorAnchorTags = options => ev => {
    if (delay) {
      return;
    }

    // If the timeout exists, return early.
    if (timeout) {
      return;
    }

    // Set a debounce timeout.
    timeout = setTimeout(() => {
      timeout = null;
      update();
    }, 200);
  };

  document.onscroll = monitorAnchorTags();

  document.querySelector('nav ul').onclick = ev => {
    if (ev.target.parentNode.matches('a')) {
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      timeout = true;
      setTarget(ev.target.parentNode.getAttribute('href'), { update: false });
      setTimeout(() => timeout = false, 200);
    }
  };

  document.querySelector('.open-menu').onclick = ev => {
    ev.stopImmediatePropagation();

    const body = document.querySelector('body');
    const content = document.querySelector('section#content');

    if (body.classList.contains('open')) {
      return body.onclick();
    }

    body.classList.add('open');

    body.onclick = () => {
      body.classList.remove('open');
      body.onclick = null;
    };
  };
});

const mount = document.querySelector('#api-browser');
console.log(mount);
innerHTML(mount, html`<${ApiBrowser} />`);
