import { html, innerHTML, addTransitionState } from 'https://diffhtml.org/core';

const duration = 3000;

addTransitionState('attributeChanged', (domNode, attrName, oldValue, newValue) => {
  if (attrName !== 'id') {
    return;
  }

  const frames = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-50%)' },
  ];

  domNode.animate(frames, { duration }).finished;
});

const promisesKeyframe = document.querySelector('#promises-keyframe');

let frame = 0;

function renderFrame(number) {
  innerHTML(promisesKeyframe, html`
    <div id="frame-${number}">
      <span>${String(number)}</span>
    </div>
  `);
}

setInterval(() => {
  frame++;
  renderFrame(frame);
}, duration);

renderFrame(frame);
