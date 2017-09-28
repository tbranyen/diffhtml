const { html } = require('diffhtml');
const Nav = require('./nav');

module.exports = ({ path, pages, content }) => html`
  <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>diffHTML: The easy-to-use HTML Virtual DOM built for the web!</title>
      <link rel="stylesheet" href="./index.css">
    </head>

    <body>
      <layer id="navigation">
        <div class="open-menu">≡</div>
        <${Nav} pages=${pages} />
      </layer>

      <layer id="main">
        <header>
          <h1>
            <a href="/"><img width="120" src="/images/diffhtml-logo.png"></a>
            <div>
              <p>diffHTML</p>
              <p>The easy-to-use Virtual DOM built for the web!</p>
            </div>
          </h1>
        </header>

        <section id="content">${content}</section>

        <a
          href=${`https://github.com/tbranyen/diffhtml/edit/master/packages/diffhtml-website/pages/${path.replace('.html', '.md')}`}
          style=${`
            text-align: center;
            color: #333;
            text-decoration: none;
            width: 100%;
            display: inline-block;
            padding: 40px;
            box-sizing: border-box;
          `}
        >
          Edit on GitHub &nbsp; <span class="fa fa-github"></span>
        </a>

        <footer>
          Built with
          <span class="fa fa-heart" style="color: red; margin: 0 15px;"></span>
          <a href="https://twitter.com/tbranyen" style="text-decoration: none;">
            <strong>by @tbranyen</strong></a>
            <span style="margin-left: 15px;"> | </span>
            <a style="margin-left: 15px; text-decoration: none;" href="https://raw.githubusercontent.com/tbranyen/diffhtml/master/LICENSE"> MIT License</a>
        </footer>
      </layer>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
      <script src="/node_modules/diffhtml/dist/diffhtml.js"></script>
      <script src="/node_modules/diffhtml-components/dist/web-component.js"></script>
      <script>
        hljs.initHighlightingOnLoad();

        // Every time a refresh happens, reload the highlight code block.
        setTimeout(() => staticSyncHandlers.add(() => {
          setTimeout(() => [...document.querySelectorAll('pre code')].forEach(block => {
            hljs.highlightBlock(block);
          }));
        }));

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
