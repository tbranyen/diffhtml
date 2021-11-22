const { html } = require('diffhtml');
const { version } = require('../package');
const Nav = require('./nav');
const { NODE_ENV } = process.env;

module.exports = ({ path, page, pages, content }) => html`
  <html key="root">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>diffHTML: An easy-to-use HTML Virtual DOM built for the web!</title>
      <link rel="stylesheet" href="https://tbranyen.github.io/diffhtml/index.css">
    </head>

    <body class=${page.toLowerCase().replace(/\s/g, '-')}>
      <layer id="navigation">

        <p class="social">
          <a class="github" href="https://github.com/tbranyen/diffhtml">
            <i class="fa fa-github"></i>
          </a>
          <!--
          <a class="stackoverflow" href="https://stackoverflow.com/search?q=diffhtml+javascript">
            <i class="fa fa-stack-overflow"></i>
          </a>
          <a class="twitter" href="https://twitter.com/diffhtml">
            <i class="fa fa-twitter"></i>
          </a>
          <a class="reddit" href="https://reddit.com/r/diffhtml">
            <i class="fa fa-reddit"></i>
          </a>
          -->
        </p>

        <${Nav} pages=${pages} />
      </layer>

      <layer id="main">
        <div class="open-menu">≡</div>
        <header>
          <h1>
            <a href="/"><img width="120" src="./images/diffhtml-logo.png"></a>
            <div>
              <p class="name">diffHTML</p><sub>v${version}</sub>
              <p>An easy-to-use Virtual DOM built for the web!</p>
            </div>
          </h1>
        </header>

        <hr />

        <section id="content">${content}</section>

        <a
          href=${`https://github.com/tbranyen/diffhtml/edit/master/packages/diffhtml-website/pages/${path.replace('.html', '.md')}`}
          id="edit-on-github"
        >
          Edit on GitHub &nbsp; <span class="fa fa-github"></span>
        </a>

        <footer>
          <a target="_blank" href="https://twitter.com/tbranyen" style="text-decoration: none;">
            <span>Created by @tbranyen</span>
          </a>
          <span style="margin: 0 15px;"> | </span>
          <a target="_blank" href="https://twitter.com/s0phinie" style="text-decoration: none;">
            <span>Logo by @s0phinie</span>
          </a>
          <span style="margin-left: 15px;"> | </span>
          <a target="_blank" style="margin-left: 15px; text-decoration: none;" href="https://raw.githubusercontent.com/tbranyen/diffhtml/master/LICENSE"> MIT License</a>
        </footer>
      </layer>

      <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.min.js"></script>
      <script src="https://tbranyen.github.io/diffhtml/scripts/highlight.min.js"></script>
      <script key="source">
        try { hljs.initHighlightingOnLoad(); } catch (ex) {}

        ${NODE_ENV !== 'production' && html`
          // Every time a refresh happens, reload the highlight code block.
          let interval;

          interval = setInterval(() => {
            if (typeof staticSyncHandlers !== 'undefined') {
              clearInterval(interval);

              staticSyncHandlers.add(() => {
                setTimeout(() => [...document.querySelectorAll('pre code')].forEach(block => {
                  hljs.highlightBlock(block);
                }));
              });
            }
          }, 200);
        `}

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
      </script>
    </body>
  </html>
`;
