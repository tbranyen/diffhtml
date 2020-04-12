import { ok, equal, throws } from 'assert';
import * as diff from '../../lib/index';
import validateMemory from '../util/validate-memory';

describe('Integration: Transitions', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(() => {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  describe('Adding states', () => {
    it('will throw when missing the required name argument', () => {
      throws(() => {
        diff.addTransitionState();
      }, /Invalid state name 'undefined'/);
    });

    it('will throw when missing the required callback argument', () => {
      throws(() => {
        diff.addTransitionState('attached');
      }, /Missing transition state callback/);
    });

    it('will throw when passed an invalid state name', () => {
      throws(() => {
        diff.addTransitionState('added', () => {});
      }, /Invalid state name 'added'/);
    });

    it('will trigger the added attached state', () => {
      var hit = 0;

      diff.addTransitionState('attached', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      equal(hit, 1);
    });

    it('will trigger the added attached state for nested', () => {
      var hit = 0;

      diff.addTransitionState('attached', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p><span></span></p></div>');

      equal(hit, 2);
    });

    it('will trigger the added detached state', () => {
      var hit = 0;

      diff.addTransitionState('detached', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div></div>');

      equal(hit, 1);
    });

    it('will trigger the added replaced state', () => {
      var hit = 0;

      diff.addTransitionState('replaced', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span></span></div>');

      equal(hit, 1);
    });

    it('will trigger the added attributeChanged state', () => {
      var hit = 0;

      diff.addTransitionState('attributeChanged', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p class="word"></p></div>');

      equal(hit, 1);
    });

    it('will trigger the added textChanged state', () => {
      var hit = 0;

      diff.addTransitionState('textChanged', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p>hello world</p></div>');

      equal(hit, 1);
    });

    it('provides correct args to attributeChanged', () => {
      var el = null;
      var name = null;
      var old = null;
      var current = null;

      function setValues(_el, _name, _old, _current) {
        el = _el;
        name = _name;
        old = _old;
        current = _current;
      }

      // First with adding a new attribute.
      diff.addTransitionState('attributeChanged', setValues);

      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p class="word"></p></div>');

      equal(name, 'class');
      equal(old, null);
      equal(current, 'word');

      diff.removeTransitionState('attributeChanged', setValues);

      // Then with changing an attribute.
      diff.addTransitionState('attributeChanged', setValues);

      diff.innerHTML(this.fixture, '<div><p class="yo"></p></div>');

      equal(name, 'class');
      equal(old, 'word');
      equal(current, 'yo');

      diff.removeTransitionState('attributeChanged', setValues);

      // Finally removing the attribute.
      diff.addTransitionState('attributeChanged', setValues);

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      equal(name, 'class');
      equal(old, 'yo');
      equal(current, null);

      diff.removeTransitionState('attributeChanged', setValues);
    });

    it('will trigger attributeChanged when attached', () => {
      var called = false;

      diff.addTransitionState('attributeChanged', (...args) => {
        called = args;
      });

      diff.innerHTML(this.fixture, '<div id="test"></div>');

      ok(called);
      equal(called[0], this.fixture.firstChild);
      equal(called[1], 'id');
      equal(called[2], null);
      equal(called[3], 'test');
    });

    it('will trigger all element states with replacement', () => {
      var hit = { attached: 0, replaced: 0, detached: 0 };

      diff.addTransitionState('attached', element => { hit.attached++; });
      diff.addTransitionState('detached', element => { hit.detached++; });
      diff.addTransitionState('replaced', element => {
        hit.replaced++;
      });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span></span></div>');

      equal(hit.attached, 2, 'Added is triggered for p and span');
      equal(hit.detached, 1, 'Removed is only triggered for p');
      equal(hit.replaced, 1, 'Replaced is only triggered for span');
    });
  });

  describe('Removing states', () => {
    it('can remove all states', () => {
      var hit = 0;

      diff.addTransitionState('attached', element => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState();
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      equal(hit, 1);
    });

    it('can remove all states by name', () => {
      var hit = 0;

      diff.addTransitionState('attached', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState('attached');
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      equal(hit, 1);
    });

    it('can remove state by name and callback reference', () => {
      var hit = 0;

      function attachedState(element) { hit++; }

      diff.addTransitionState('attached', attachedState);
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState('attached', attachedState);
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      equal(hit, 1);
    });
  });

  describe('Argument verification', () => {
    it('will provide the correct element to attached', () => {
      var result = null;

      diff.addTransitionState('attached', function(el) { result = el; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      equal(result, this.fixture.querySelector('p'));
    });

    it('will provide the last element to detached without key', () => {
      var result = null;

      diff.addTransitionState('detached', el => { result = el; });

      diff.innerHTML(this.fixture, `<div>
        <p id="1"></p>
        <p id="2"></p>
        <p id="3"></p>
      </div>`);

      var p = this.fixture.querySelector('[id="3"]');

      diff.innerHTML(this.fixture, `<div>
        <p id="1"></p>
        <p id="3"></p>
      </div>`);

      equal(result.id, '3');
      equal(result, p);
      equal(result.parentNode, null);
    });

    it('will replace instead of remove if no new keys match', () => {
      diff.innerHTML(this.fixture, `<div>
        <p id="1"></p>
        <p id="2"></p>
      </div>`);

      diff.innerHTML(this.fixture, `<div>
        <p id="3"></p>
      </div>`);

      equal(this.fixture.querySelectorAll('p').length, 1);
    });

    it('will provide the correct element to detached when using key', () => {
      var result = null;

      diff.addTransitionState('detached', el => { result = el; });

      diff.innerHTML(this.fixture, `<div>
        <p id="1" key="1"></p>
        <p id="2" key="2"></p>
        <p id="3" key="3"></p>
      </div>`);

      var p = this.fixture.querySelector('[id="2"]');

      diff.innerHTML(this.fixture, `<div>
        <p id="1" key="1"></p>
        <p id="3" key="3"></p>
      </div>`);

      equal(result.id, '2');
      equal(result, p);
      equal(result.parentNode, null);
    });

    it('will provide the correct arguments to replaced', () => {
      var oldElement = null;
      var newElement = null;

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      diff.addTransitionState('replaced', (...args) => {
        oldElement = args[0];
        newElement = args[1];
      });

      var p = this.fixture.querySelector('p');

      diff.innerHTML(this.fixture, '<div><span></span></div>');

      equal(oldElement, p);
      equal(oldElement.parentNode, null);

      equal(newElement, this.fixture.querySelector('span'));
      equal(newElement.parentNode, this.fixture.firstChild);
    });

    it('will provide the correct arguments to attributeChanged (added)', () => {
      var element, attributeName, oldValue, newValue;

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      diff.addTransitionState('attributeChanged', (...args) => {
        element = args[0];
        attributeName = args[1];
        oldValue = args[2];
        newValue = args[3];
      });

      diff.innerHTML(this.fixture, '<div><p class="test"></p></div>');

      var p = this.fixture.querySelector('p');

      equal(element, p);
      equal(attributeName, 'class');
      equal(oldValue, null);
      equal(newValue, 'test');
    });

    it('will provide the correct arguments to textChanged (added)', () => {
      var el, oldText, newText;

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      diff.addTransitionState('textChanged', (...args) => {
        el = args[0];
        oldText = args[1];
        newText = args[2];
      });

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      equal(el, this.fixture.querySelector('p').firstChild);
      equal(oldText, null);
      equal(newText, 'test');
    });

    it('will provide the correct arguments to textChanged (replaced)', () => {
      var el, oldText, newText;

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      diff.addTransitionState('textChanged', (...args) => {
        el = args[0];
        oldText = args[1];
        newText = args[2];
      });

      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');

      equal(el, this.fixture.querySelector('p').firstChild);
      equal(oldText, 'test');
      equal(newText, 'test2');
    });
  });

  describe('Handling Promise return values', () => {
    it('will hold off rendering until attached promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      const assertions = [
        () => equal(fixture.querySelector('p').textContent, ''),
        () => equal(this.fixture.querySelector('p').textContent, 'test'),
      ];

      const unsubscribe = use(transaction => {
        transaction.onceEnded(() => assertions.shift()());
      });

      addTransitionState('attached', () => promise);

      const first = () => innerHTML(fixture, '<div><p></p></div>');
      const second = () => innerHTML(fixture, '<div><p>test</p</div>');

      return first().then(second).then(unsubscribe);
    });

    it('will hold off rendering until detached (during replace) promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      const assertions = [
        () => ok(fixture.querySelector('p')),
        () => {
          equal(fixture.querySelector('p'), null);
          equal(fixture.querySelector('span').textContent, 'test');
        },
        () => equal(fixture.querySelector('span').textContent, 'test2'),
      ];

      const unsubscribe = use(transaction => {
        transaction.onceEnded(() => assertions.shift()());
      });

      addTransitionState('detached', () => promise);

      const first = () => innerHTML(fixture, '<div><p></p></div>');
      const second = () => innerHTML(fixture, '<div><span>test</span></div>');
      const third = () => innerHTML(fixture, '<div><span>test2</span></div>');

      return first().then(second).then(third).then(unsubscribe);
    });

    it('will hold off rendering until detached (no replace) promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      const assertions = [
        () => ok(fixture.querySelector('p')),
        () => {
          equal(fixture.querySelector('p'), null);
          equal(fixture.querySelector('span'), null);
        },
        () => equal(fixture.querySelector('span').textContent, 'test'),
      ];

      const unsubscribe = use(transaction => {
        transaction.onceEnded(() => assertions.shift()());
      });

      addTransitionState('detached', () => promise);

      const first = () => innerHTML(fixture, '<div><p></p></div>');
      const second = () => innerHTML(fixture, '<div></div>');
      const third = () => innerHTML(fixture, '<div><span>test</span></div>');

      return first().then(second).then(third).then(unsubscribe);
    });

    it('will hold off rendering until replaced promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      const assertions = [
        () => ok(this.fixture.querySelector('p')),
        () => {
          equal(this.fixture.querySelector('p'), null);
          ok(this.fixture.querySelector('span'));
          equal(this.fixture.querySelector('span').textContent, 'test');
        },
        () => equal(this.fixture.querySelector('span').textContent, 'test2'),
      ];

      const unsubscribe = use(transaction => {
        transaction.onceEnded(() => assertions.shift()());
      });

      addTransitionState('replaced', () => promise);

      const first = () => innerHTML(fixture, '<div><p></p></div>');
      const second = () => innerHTML(fixture, '<div><span>test</span></div>');
      const third = () => innerHTML(fixture, '<div><span>test2</span></div>');

      return first().then(second).then(third).then(unsubscribe);
    });

    it('will hold off rendering until attributeChanged promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      const assertions = [
        () => {
          ok(fixture.querySelector('p'));
          equal(fixture.querySelector('p').className, '');
        },
        () => equal(fixture.querySelector('p').className, 'test'),
        () => equal(fixture.querySelector('p').className, 'test2'),
      ];

      const unsubscribe = use(transaction => {
        transaction.onceEnded(() => assertions.shift()());
      });

      addTransitionState('attributeChanged', () => promise);

      const first = innerHTML(fixture, '<div><p></p></div>');
      const second = innerHTML(fixture, '<div><p class="test"></p></div>');
      const third = innerHTML(fixture, '<div><p class="test2"></p></div>');

      return Promise.all([first, second, third]).then(unsubscribe).then(() => {
        equal(fixture.querySelector('p').className, 'test2');
        equal(assertions.length, 0);
      });
    });

    it('will hold off rendering until textChanged (added) promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      addTransitionState('textChanged', () => promise);

      const assertions = [
        () => equal(fixture.querySelector('p').textContent, ''),
        () => equal(fixture.querySelector('p').textContent, 'test'),
        () => equal(fixture.querySelector('p').textContent, 'test2'),
      ];

      const unsubscribe = use(transaction => {
        transaction.onceEnded(() => assertions.shift()(transaction));
      });

      const first = innerHTML(fixture, '<div><p></p></div>');
      const second = innerHTML(fixture, '<div><p>test</p></div>');

      // Text gets changed immediately, but now we are `isRendering`, so the
      // next transaction will get "aborted" and scheduled to run after this
      // completes.
      equal(fixture.querySelector('p').textContent, 'test');

      const third = innerHTML(fixture, '<div><p>test2</p></div>');

      equal(fixture.querySelector('p').textContent, 'test');

      return third.then(() => {
        equal(fixture.querySelector('p').textContent, 'test2');
        unsubscribe();
      });
    });

    it('will hold off rendering until textChanged (replaced) promise resolves', () => {
      const promise = Promise.resolve();
      const { use, innerHTML, addTransitionState } = diff;
      const { fixture } = this;

      addTransitionState('textChanged', () => promise);

      innerHTML(fixture, '<div><p>test</p></div>');

      return innerHTML(fixture, '<div><p>test2</p></div>').then(() => {
        equal(fixture.querySelector('p').textContent, 'test2')

        return innerHTML(fixture, '<div><p>test3</p></div>').then(() => {
          equal(fixture.querySelector('p').textContent, 'test3');
        });
      });
    });
  });

  describe.skip('Attached state', () => {
    it('will trigger the added attached state', () => {
      var hit = 0;

      diff.addTransitionState('attached', () => { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      equal(hit, 1);
    });
  });

  describe('TextChanged state', () => {
    it('will correctly handle memory with text changed promise', async () => {
      diff.addTransitionState('textChanged', () => Promise.resolve());

      await diff.innerHTML(this.fixture, '<div><p>test</p></div>');
      equal(this.fixture.innerHTML, '<div><p>test</p></div>');

      const transaction = await diff.innerHTML(this.fixture, '<div><p>test 123</p></div>');
      equal(this.fixture.innerHTML, '<div><p>test 123</p></div>');

      let match = 0;

      const { firstChild } = this.fixture.querySelector('p');
      const textNode = transaction.state.oldTree.childNodes[0].childNodes[0].childNodes[0];

      // Look up both DOM Node and vTree association in NodeCache.
      diff.Internals.NodeCache.forEach((value, key) => {
        if (value === firstChild) {
          match += 1;
        }

        if (key === textNode) {
          match += 1;
        }
      });

      equal(match, 2);
    });

    it('will correctly handle memory with attached and textchanged promises', async () => {
      diff.addTransitionState('attached', () => {});
      diff.addTransitionState('textChanged', () => {
        return new Promise(resolve => setTimeout(resolve, 10));
      });

      await diff.innerHTML(this.fixture, '<div><p>test</p></div>');
      equal(this.fixture.innerHTML, '<div><p>test</p></div>');

      const transaction = await diff.innerHTML(this.fixture, '<div><p>test 123</p></div>');
      equal(this.fixture.innerHTML, '<div><p>test 123</p></div>');

      let match = 0;

      const { firstChild } = this.fixture.querySelector('p');
      const textNode = transaction.state.oldTree.childNodes[0].childNodes[0].childNodes[0];

      // Look up both DOM Node and vTree association in NodeCache.
      diff.Internals.NodeCache.forEach((value, key) => {
        if (value === firstChild) {
          match += 1;
        }

        if (key === textNode) {
          match += 1;
        }
      });

      equal(match, 2);
    });
  });
});
