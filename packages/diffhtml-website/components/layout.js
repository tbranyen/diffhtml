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
      <div class="open-menu">≡</div>
      <layer id="navigation">

        <p class="social">
          <a class="github" href="https://github.com/tbranyen/diffhtml">
            <i class="fa fa-github"></i>
          </a>
          <a class="stackoverflow" href="https://stackoverflow.com/search?q=diffhtml+javascript">
            <i class="fa fa-stack-overflow"></i>
          </a>
          <a class="twitter" href="https://twitter.com/diffhtml">
            <i class="fa fa-twitter"></i>
          </a>
          <a class="reddit" href="https://reddit.com/r/diffhtml">
            <i class="fa fa-reddit"></i>
          </a>
        </p>

        <${Nav} pages=${pages} />
      </layer>

      <layer id="main">
        <header>
          <h1>
            <a href="/"><img width="120" src="./images/diffhtml-logo.png"></a>
            <div>
              <p class="name">diffHTML</p><sub>v1.0.0</sub>
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
          <a href="https://twitter.com/tbranyen" style="text-decoration: none;">
            <span>Created by @tbranyen</span>
          </a>
          <span style="margin: 0 15px;"> | </span>
          <a href="https://twitter.com/tbranyen" style="text-decoration: none;">
            <span>Logo by @s0phinie</span>
          </a>
          <span style="margin-left: 15px;"> | </span>
          <a style="margin-left: 15px; text-decoration: none;" href="https://raw.githubusercontent.com/tbranyen/diffhtml/master/LICENSE"> MIT License</a>
        </footer>
      </layer>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
      <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.js"></script>
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
