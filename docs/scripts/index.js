try { hljs.initHighlightingOnLoad(); } catch {}

if (NODE_ENV !== 'production' && typeof staticSyncHandlers !== 'undefined') {
  // Every time a refresh happens, reload the highlight code block.
  staticSyncHandlers.add(() => {
    setTimeout(() => [...document.querySelectorAll('pre code')].forEach(block => {
      hljs.highlightBlock(block);
    }));
  });
}

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

// Promises Keyframe example serial animations.
//const promisesKeyframe = document.querySelector('#promises-keyframe');
//
//if (promisesKeyframe) {
//  import('/scripts/promises-keyframe.js');
//}
