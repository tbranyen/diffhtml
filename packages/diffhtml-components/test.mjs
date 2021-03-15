import { html, toString } from 'diffhtml';
import './component';

function App(props) {
  return html`
    <div>Hello ${props.place}!</div>
  `;
}

console.log(
  toString(html`<${App} />`)
);
