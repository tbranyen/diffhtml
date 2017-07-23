const { html } = require('diffhtml');

module.exports = ({ pages }) => html`
  <ul>
    ${pages.map(({ href, name, type }) => html`
      ${type === 'page' && html`
        <a href=${href}><li class="header"><h4>${name}</h4></li></a>
      `}

      ${type === 'subpage' && html`
        <a href=${href}><li>${name}</li></a>
      `}
    `)}
  </ul>
`;
