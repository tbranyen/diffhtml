const { html, innerHTML } = require('diffhtml/runtime');

// Render a div with dynamic children and onclick
function renderTime(time) {
  innerHTML(document.body, html`
    <button onclick=${e => renderTime(new Date())}>Get time</button>
    <output>${time}</output>
  `);
}

renderTime(new Date());
