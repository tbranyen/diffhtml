import { outerHTML, html } from '../../lib/index';

function render(date) {
  outerHTML(document.querySelector('main'), html`<main>
    <h1>Some new content diff/patched in!</h1>

    <p>
      <span>Current date: ${date}</span>
    </p>
  </main>`);
}

setInterval(function() {
  render(new Date().toLocaleString());
}, 1000);

render(new Date().toLocaleString());
