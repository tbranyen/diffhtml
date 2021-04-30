const { assign, keys } = Object;
const { isArray } = Array;

const defaults = {
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,       // requires parser change
  "attr-value-not-empty": false,
  "attr-no-duplication": true,            // requires parser change
  "doctype-first": true,                  // requires parser change
  "tag-pair": true,                       // requires parser change
  "empty-tag-not-self-closed": true,      // requires parser change
  "spec-char-escape": true,               // requires parser change
  "id-unique": true,
  "src-not-empty": true,
  "title-require": true,
  "alt-require": true,
  "doctype-html5": true,                  // requires parser change
  "id-class-value": "dash",
  "style-disabled": false,
  "inline-style-disabled": false,
  "inline-script-disabled": false,
  "space-tab-mixed-disabled": "space",    // requires parser change
  "id-class-ad-disabled": false,          // tbd
  "href-abs-or-rel": false,               // tbd
  "attr-unsafe-chars": true,
  "head-script-disabled": true,
};

const unsafeRegexp = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

const srcTagNames = [
  'img',
  'video',
  'script',
  'link',
  'embed',
  'bgsound',
  'iframe',
  'object',
];

const state = {
  ids: new Set(),
  errors: /** @type {any} */ ([]),
  warnings: /** @type {any} */ ([]),
};

const linter = ({ rules, renderErrors }) => {
  rules = assign({}, defaults, rules);

  return assign(transaction => {
    console.info('Linting started with rules %o', rules);

    return () => {
      if (renderErrors && state.errors.length) {
        transaction.domNode.innerHTML += `
          <div style="background: #FAF7E8; border-top: 2px solid #FF0000; padding-bottom: 20px">
            <h1>Validation errors</h1>
            <h2 style="background:#FFB400;color:#FFF">Warnings</h2>
            <ul>${state.warnings.map(err => `<li style="color:#FFB400">
              <strong>${err}</strong>
            </li>`).join('\n')}</ul>
            <h2 style="background:#FF3D00;color:#FFF">Errors</h2>
            <ul>${state.errors.map(err => `<li style="color:#FF3D00">
              <strong>${err}</strong>
            </li>`).join('\n')}</ul>
          </div>
        `;
        //innerHTML(transaction.domNode, renderError({
        //  errors: state.errors,
        //  toString() {
        //    return state.errors.join('\n');
        //  }
        //}));
      }

      state.ids.clear();

      console.info('Linting completed');
    };
  }, {
    displayName: 'linterTask',

    createNodeHook(vTree) {
      const { rawNodeName, nodeName, childNodes, attributes } = vTree;

      if (nodeName === 'head') {
        let hasTitle = false;
        let hasScript = false;

        childNodes.forEach(({ nodeName }) => {
          if (nodeName === 'title') {
            hasTitle = true;
          }

          if (nodeName === 'script') {
            hasScript = true;
          }
        });

        // head-script-disabled
        if (rules['head-script-disabled'] && hasScript) {
          const msg = `[title-require] head element must contain title`;
          state.warnings.push(msg);
          console.warn(msg);
        }

        // title-require
        if (rules['title-require'] && !hasTitle) {
          const msg = `[title-require] head element must contain title`;
          state.errors.push(msg);
          console.error(msg);
        }
      }

      // alt-require
      if (rules['alt-require'] && nodeName === 'img' && !attributes.alt) {
        const msg = '[alt-require] img tag must have an alt present';
        state.warnings.push(msg);
        console.warn(msg);
      }

      // style-disabled
      if (nodeName === 'style') {
        console.warn(`[style-disabled] use of style tag is disabled`);
      }

      keys(attributes).forEach(key => {
        const lowerKey = key.toLowerCase();
        const value = attributes[key];

        const absOrRel = rules['href-abs-or-rel'];

        // href-abs-or-rel
        if (absOrRel && lowerKey === 'href') {
          const msg = `[href-abs-or-rel] '${value}' must be ${absOrRel}`;
          state.warnings.push(msg);
          console.warn(msg);
        }

        // attr-unsafe-chars
        if (rules['attr-unsafe-chars'] && String(value).match(unsafeRegexp)) {
          const msg = `[attr-unsafe-chars] '${value}' contains unsafe characters`;
          state.warnings.push(msg);
          console.warn(msg);
        }

        // inline-style-disabled
        if (rules['inline-style-disabled'] && lowerKey === 'style') {
          const msg = `[inline-style-disabled] cannot use inline styles`;
          state.warnings.push(msg);
          console.warn(msg);
        }

        // inline-script-disabled
        if (rules['inline-script-disabled'] && (
          value.includes('javascript:') ||
          value.includes('(') ||
          value.includes('[') ||
          value.includes('{')
        )) {
          const msg = `[inline-script-disabled] detected inline script execution`;
          state.warnings.push(msg);
          console.warn(msg);
        }

        const idClassValue = rules['id-class-value'];
        const validFormats = ['underline', 'dash', 'hump'];

        // id-class-value
        if (idClassValue && (lowerKey === 'id' || lowerKey === 'class')) {
          if (!validFormats.includes(idClassValue)) {
            throw new Error('Invalid configuration format for [id-class-value]');
          }

          let failed = null;

          if (idClassValue === 'underline') {
            failed = !String(value).match(/^[a-z\d]+(_[a-z\d]+)*$/);
          }
          else if (idClassValue === 'dash') {
            failed = !String(value).match(/^[a-z\d]+(-[a-z\d]+)*$/);
          }
          else if (idClassValue === 'hump') {
            failed = !String(value).match(/^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/);
          }

          if (failed) {
            const msg = `[id-class-value] '${value}' must be in ${idClassValue} format`;
            state.warnings.push(msg);
            console.warn(msg);
          }
        }

        // id-unique
        if (rules['id-unique'] === true && lowerKey === 'id' && state.ids.has(attributes[key])) {
          const msg = `[id-unique] encountered duplicate '${attributes[key]}'`;
          state.errors.push(msg);
          console.error(msg);
        }

        const attrLowercase = rules['attr-lowercase'];

        // attr-lowercase
        if (attrLowercase === true || isArray(attrLowercase) && attrLowercase.indexOf(nodeName) === -1) {
          if (lowerKey !== key) {
            const msg = `[attr-lowercase] attributes must be lowercase, encountered ${key}`;
            state.warnings.push(msg);
            console.warn(msg);
          }
        }

        // attr-value-not-empty
        if (
          rules['attr-value-not-empty'] && (
            attributes[key] === undefined ||
            attributes[key] === null ||
            attributes[key] === ''
          )
        ) {
          const msg = `[attr-value-not-empty] ${rawNodeName} ${key} cannot be empty`;
          state.warnings.push(msg);
          console.warn(msg);
        }

        // Track id values.
        if (lowerKey === 'id') {
          state.ids.add(attributes[key]);
        }
      });

      // tagname-lowercase
      if (rules['tagname-lowercase'] && rawNodeName.toUpperCase() === rawNodeName) {
        const msg = `[tagname-lowercase] ${rawNodeName} must be lowercase`;
        state.errors.push(msg);
        console.error(msg);
      }

      // src-not-empty
      if (rules['src-not-empty'] && srcTagNames.includes(nodeName) && !attributes.src) {
        const msg = `[src-not-empty] ${nodeName} must have a valid src attribute`;
        state.errors.push(msg);
        console.error(msg);
      }
    },
  });
};

export default (opts = {}) => linter(opts);
