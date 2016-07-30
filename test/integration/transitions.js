import * as diff from '../../lib/index.js';
import validateMemory from '../util/validateMemory';

describe('Integration: Transitions', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  describe('Adding states', function() {
    it('will throw when missing the required name argument', function() {
      assert.throws(function() {
        diff.addTransitionState();
      }, 'Missing transition state name');
    });

    it('will throw when missing the required callback argument', function() {
      assert.throws(function() {
        diff.addTransitionState('attached');
      }, 'Missing transition state callback');
    });

    it('will throw when passed an invalid state name', function() {
      assert.throws(function() {
        diff.addTransitionState('added', function() {});
      }, 'Invalid state name: added');
    });

    it('can add the attached state', function() {
      var hit = 0;

      diff.addTransitionState('attached', function() { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      assert.equal(hit, 1);
    });

    it('can add the detached state', function() {
      var hit = 0;

      diff.addTransitionState('detached', function() { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div></div>');

      assert.equal(hit, 1);
    });

    it('can add the replaced state', function() {
      var hit = 0;

      diff.addTransitionState('replaced', function() { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span></span></div>');

      assert.equal(hit, 1);
    });

    it('can add the attributeChanged state', function() {
      var hit = 0;

      diff.addTransitionState('attributeChanged', function() { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p class="word"></p></div>');

      assert.equal(hit, 1);
    });

    it('can add the textChanged state', function() {
      var hit = 0;

      diff.addTransitionState('textChanged', function() { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p>hello world</p></div>');

      assert.equal(hit, 1);
    });

    it('provides correct args to attributeChanged', function() {
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

      assert.equal(name, 'class');
      assert.equal(old, null);
      assert.equal(current, 'word');

      diff.removeTransitionState('attributeChanged', setValues);

      // Then with changing an attribute.
      diff.addTransitionState('attributeChanged', setValues);

      diff.innerHTML(this.fixture, '<div><p class="yo"></p></div>');

      assert.equal(name, 'class');
      assert.equal(old, 'word');
      assert.equal(current, 'yo');

      diff.removeTransitionState('attributeChanged', setValues);

      // Finally removing the attribute.
      diff.addTransitionState('attributeChanged', setValues);

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      assert.equal(name, 'class');
      assert.equal(old, 'yo');
      assert.equal(current, null);

      diff.removeTransitionState('attributeChanged', setValues);
    });

    it('will trigger attributeChanged when attached', function() {
      var called = false;

      diff.addTransitionState('attributeChanged', function() {
        called = arguments;
      });

      diff.innerHTML(this.fixture, '<div id="test"></div>');

      assert.ok(called);
      assert.equal(called[0], this.fixture.firstChild);
      assert.equal(called[1], 'id');
      assert.equal(called[2], null);
      assert.equal(called[3], 'test');
    });

    it('will trigger all element states with replacement', function() {
      var hit = { attached: 0, replaced: 0, detached: 0 };

      diff.addTransitionState('attached', function(element) { hit.attached++; });
      diff.addTransitionState('detached', function(element) { hit.detached++; });
      diff.addTransitionState('replaced', function(element) {
        hit.replaced++;
      });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span></span></div>');

      assert.equal(hit.attached, 2, 'Added is triggered for p and span');
      assert.equal(hit.detached, 1, 'Removed is only triggered for p');
      assert.equal(hit.replaced, 1, 'Replaced is only triggered for span');
    });
  });

  describe('Removing states', function() {
    it('can remove all states', function() {
      var hit = 0;

      diff.addTransitionState('attached', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState();
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      assert.equal(hit, 1);
    });

    it('can remove all states by name', function() {
      var hit = 0;

      diff.addTransitionState('attached', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState('attached');
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      assert.equal(hit, 1);
    });

    it('can remove state by name and callback reference', function() {
      var hit = 0;

      function attachedState(element) { hit++; }

      diff.addTransitionState('attached', attachedState);
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState('attached', attachedState);
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      assert.equal(hit, 1);
    });
  });

  describe('Argument verification', function() {
    it('will provide the correct element to attached', function() {
      var result = null;

      diff.addTransitionState('attached', function(el) { result = el; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      assert.equal(result, this.fixture.querySelector('p'));
    });

    it('will provide the last element to detached without key', function() {
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

      assert.equal(result.id, '3');
      assert.equal(result, p);
      assert.equal(result.parentNode, null);
    });

    it('will replace instead of remove if no new keys match', function() {
      diff.innerHTML(this.fixture, `<div>
        <p id="1"></p>
        <p id="2"></p>
      </div>`);

      diff.innerHTML(this.fixture, `<div>
        <p id="3"></p>
      </div>`);

      assert.equal(this.fixture.querySelectorAll('p').length, 1);
    });

    it('will provide the correct element to detached when using key', function() {
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

      assert.equal(result.id, '2');
      assert.equal(result, p);
      assert.equal(result.parentNode, null);
    });

    it('will provide the correct arguments to replaced', function() {
      var oldElement = null;
      var newElement = null;

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      diff.addTransitionState('replaced', function() {
        oldElement = arguments[0];
        newElement = arguments[1];
      });

      var p = this.fixture.querySelector('p');

      diff.innerHTML(this.fixture, '<div><span></span></div>');

      assert.equal(oldElement, p);
      assert.equal(oldElement.parentNode, null);

      assert.equal(newElement, this.fixture.querySelector('span'));
      assert.equal(newElement.parentNode, this.fixture.firstChild);
    });

    it('will provide the correct arguments to attributeChanged (added)', function() {
      var element, attributeName, oldValue, newValue;

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      diff.addTransitionState('attributeChanged', function() {
        element = arguments[0];
        attributeName = arguments[1];
        oldValue = arguments[2];
        newValue = arguments[3];
      });

      diff.innerHTML(this.fixture, '<div><p class="test"></p></div>');

      var p = this.fixture.querySelector('p');

      assert.equal(element, p);
      assert.equal(attributeName, 'class');
      assert.equal(oldValue, null);
      assert.equal(newValue, 'test');
    });

    it('will provide the correct arguments to textChanged (added)', function() {
      var el, oldText, newText;

      diff.innerHTML(this.fixture, '<div><p></p></div>');

      diff.addTransitionState('textChanged', function() {
        el = arguments[0];
        oldText = arguments[1];
        newText = arguments[2];
      });

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      assert.equal(el, this.fixture.querySelector('p').firstChild);
      assert.equal(oldText, null);
      assert.equal(newText, 'test');
    });

    it('will provide the correct arguments to textChanged (replaced)', function() {
      var el, oldText, newText;

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      diff.addTransitionState('textChanged', function() {
        el = arguments[0];
        oldText = arguments[1];
        newText = arguments[2];
      });

      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');

      assert.equal(el, this.fixture.querySelector('p').firstChild);
      assert.equal(oldText, 'test');
      assert.equal(newText, 'test2');
    });
  });

  describe('Handling Promise return values', function() {
    it('will hold off rendering until attached promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('p').textContent, 'test');
          unsubscribe();
          done();
        }
      });

      diff.addTransitionState('attached', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p>test</p</div>');

      assert.equal(this.fixture.querySelector('p').textContent, '');
    });

    it('will hold off rendering until detached (during replace) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 1) {
          assert.ok(this.fixture.querySelector('p'));
        }
        if (count === 2) {
          assert.equal(this.fixture.querySelector('p'), null);
          assert.ok(this.fixture.querySelector('span'));
        }
        else if (count === 3) {
          assert.equal(this.fixture.querySelector('span').textContent, 'test2');
          unsubscribe();
          done();
        }
      });

      diff.addTransitionState('detached', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span>test</span></div>');
      diff.innerHTML(this.fixture, '<div><span>test2</span></div>');

      assert.equal(this.fixture.querySelector('span').textContent, 'test');
    });

    it('will hold off rendering until detached (no replace) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 1) {
          assert.ok(this.fixture.querySelector('p'));
        }
        if (count === 2) {
          assert.equal(this.fixture.querySelector('p'), null);
        }
        else if (count === 3) {
          assert.equal(this.fixture.querySelector('span').textContent, 'test');
          unsubscribe();
          done();
        }
      });

      diff.addTransitionState('detached', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div></div>');
      diff.innerHTML(this.fixture, '<div><span>test</span></div>');

      assert.equal(this.fixture.querySelector('span'), null);
    });

    it('will hold off rendering until replaced promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 1) {
          assert.ok(this.fixture.querySelector('p'));
        }
        else if (count === 2) {
          assert.equal(this.fixture.querySelector('p'), null);
          assert.ok(this.fixture.querySelector('span'));
        }
        else if (count === 3) {
          assert.equal(this.fixture.querySelector('span').textContent, 'test2');
          unsubscribe();
          done();
        }
      });

      diff.addTransitionState('replaced', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span>test</span></div>');
      diff.innerHTML(this.fixture, '<div><span>test2</span></div>');

      assert.equal(this.fixture.querySelector('span').textContent, 'test');
    });

    it('will hold off rendering until attributeChanged promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 3) {
          assert.equal(this.fixture.querySelector('p').className, 'test2');
          unsubscribe();
          done();
        }
      });

      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.addTransitionState('attributeChanged', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p class="test"></p></div>');
      diff.innerHTML(this.fixture, '<div><p class="test2"></p></div>');

      assert.equal(this.fixture.querySelector('p').className, '');
    });

    it('will hold off rendering until textChanged (added) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 3) {
          assert.equal(this.fixture.querySelector('p').textContent, 'test2');
          unsubscribe();
          done();
        }
      });

      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.addTransitionState('textChanged', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p>test</p></div>');
      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');

      assert.equal(this.fixture.querySelector('p').textContent, 'test');
    });

    it('will hold off rendering until textChanged (replaced) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      const unsubscribe = diff.use(start => sync => patch => finish => {
        count++;

        if (count === 3) {
          assert.equal(this.fixture.querySelector('p').textContent, 'test3');
          unsubscribe();
          done();
        }
      });

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');
      diff.addTransitionState('textChanged', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');
      diff.innerHTML(this.fixture, '<div><p>test3</p></div>');

      assert.equal(this.fixture.querySelector('p').textContent, 'test');
    });
  });
});
