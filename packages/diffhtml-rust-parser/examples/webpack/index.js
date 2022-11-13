import { Internals, innerHTML, html } from 'diffhtml';
import { parse } from 'diffhtml-rust-parser';

// Use Rust WASM parser at runtime during development
Internals.parse = parse;

function App() {
  return html`
    <div onClick=${() => console.log('clicked')}>
      This markup was parsed with WASM
    </div>
  `;
}

innerHTML(document.body, App());
