const { html } = require('diffhtml');
const Nav = require('./nav');

module.exports = ({ path, pages, content }) => html`
  <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>diffHTML: The easy-to-use HTML Virtual DOM for the web</title>
      <link rel="stylesheet" href="./styles.css">
    </head>

    <body>
      <layer>
        <div class="open-menu">≡</div>
        <${Nav} pages=${pages} />
      </layer>

      <section id="content">
        <header>
          <h1><±/> diffHTML</h1>
          The easy-to-use HTML Virtual DOM for the web
        </header>

        <a href=${`https://github.com/tbranyen/diffhtml/edit/improve-docs/packages/diffhtml-website/pages/${path.replace('.html', '.md')}`}>
          Edit <span class="fa fa-github"></span>
        </a>
        ${content}
      </section>

      <footer>
        Built with
        <span class="fa fa-heart" style="color: red; margin: 0 15px;"></span>
        <a href="https://twitter.com/tbranyen" style="text-decoration: none;">
          <strong>by @tbranyen</strong></a>
          <span style="margin-left: 15px;"> | </span>
          <a style="margin-left: 15px; text-decoration: none;" href="https://raw.githubusercontent.com/tbranyen/diffhtml/master/LICENSE"> MIT License</a>
      </footer>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
      <script src="/node_modules/diffhtml/dist/diffhtml.js"></script>
      <script src="/node_modules/diffhtml-components/dist/web-component.js"></script>
      <script>
        hljs.initHighlightingOnLoad();

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
