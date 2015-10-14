describe('Integration: Transitions', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();
  });

  describe('Adding states', function() {
    it('will throw when missing the required name argument', function() {
      assert.throws(function() {
        diff.addTransitionState();
      }, function(err) {
        return err instanceof diff.TransitionStateError;
      }, 'Missing transition state name');
    });

    it('will throw when missing the required callback argument', function() {
      assert.throws(function() {
        diff.addTransitionState('attached');
      }, function(err) {
        return err instanceof diff.TransitionStateError;
      }, 'Missing transition state callback');
    });

    it('will throw when passed an invalid state name', function() {
      assert.throws(function() {
        diff.addTransitionState('added', function() {});
      }, function(err) {
        return err instanceof diff.TransitionStateError;
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
    it('will provide the correct element to attached transition', function() {
      var result = null;

      diff.addTransitionState('attached', function(el) { result = el; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      assert.equal(result, this.fixture.querySelector('p'));
    });

    it('will provide the correct arguments to added text', function() {
      var el, oldText, newText;

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      diff.addTransitionState('textChanged', function() {
        el = arguments[0];
        oldText = arguments[1];
        newText = arguments[2];
      });

      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');

      assert.equal(el, this.fixture.querySelector('p'));
      assert.equal(oldText, 'test');
      assert.equal(newText, 'test2');
    });

    it('will provide the correct element to changed text', function() {
      var result = null;

      diff.addTransitionState('textChanged', function(el) { result = el; });
      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      assert.equal(result, this.fixture.querySelector('p'));
    });
  });

  describe('Handling Promise return values', function() {
    it('will hold off rendering until attached promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.addTransitionState('attached', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><p>test</p</div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('p').textContent, 'test');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p').textContent, '');
    });

    it('will hold off rendering until detached (during replace) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.addTransitionState('detached', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span>test</span></div>');
      diff.innerHTML(this.fixture, '<div><span>test2</span></div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('span').textContent, 'test2');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p'), null);
      assert.ok(this.fixture.querySelector('span'));
      assert.equal(this.fixture.querySelector('span').textContent, 'test');
    });

    it('will hold off rendering until detached (no replace) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.addTransitionState('detached', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div></div>');
      diff.innerHTML(this.fixture, '<div><span>test</span></div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('span').textContent, 'test');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p'), null);
      assert.equal(this.fixture.querySelector('span'), null);
    });

    it('will hold off rendering until replaced promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.addTransitionState('replaced', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span>test</span></div>');
      diff.innerHTML(this.fixture, '<div><span>test2</span></div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('span').textContent, 'test2');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p'), null);
      assert.ok(this.fixture.querySelector('span'));
      assert.equal(this.fixture.querySelector('span').textContent, 'test');
    });

    it('will hold off rendering until attributeChanged promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.addTransitionState('attributeChanged', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p class="test"></p></div>');

      diff.innerHTML(this.fixture, '<div><p class="test2"></p></div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('p').className, 'test2');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p').className, '');
    });

    it('will hold off rendering until textChanged (added) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.addTransitionState('textChanged', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p>test</p></div>');

      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('p').textContent, 'test2');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p').textContent, 'test');
    });

    it('will hold off rendering until textChanged (replaced) promise resolves', function(done) {
      var count = 0;
      var promise = new Promise(function(resolve) {
        setTimeout(resolve, 10);
      });

      diff.innerHTML(this.fixture, '<div><p>test</p></div>');
      diff.addTransitionState('textChanged', function(el) { return promise; });
      diff.innerHTML(this.fixture, '<div><p>test2</p></div>');
      diff.innerHTML(this.fixture, '<div><p>test3</p></div>');

      this.fixture.addEventListener('renderComplete', function() {
        count++;

        if (count === 2) {
          assert.equal(this.fixture.querySelector('p').textContent, 'test3');
          done();
        }
      }.bind(this));

      assert.equal(this.fixture.querySelector('p').textContent, 'test');
    });
  });
});
