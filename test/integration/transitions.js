describe('Transitions', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.removeTransitionState();
  });

  describe('Adding states', function() {
    it('will throw when missing the required name argument', function() {
      assert.throws(function() {
        diff.addTransitionState();
      }, function(err) {
        return err instanceof this;
      }.bind(diff.TransitionStateError), 'Missing transition state name');
    });

    it('will throw when missing the required callback argument', function() {
      assert.throws(function() {
        diff.addTransitionState('added');
      }, function(err) {
        return err instanceof this;
      }.bind(diff.TransitionStateError), 'Missing transition state callback');
    });

    it('can add the added state', function() {
      var hit = 0;

      diff.addTransitionState('added', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');

      assert.equal(hit, 1);
    });

    it('can add the removed state', function() {
      var hit = 0;

      diff.addTransitionState('removed', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div></div>');

      assert.equal(hit, 1);
    });

    it('can add the replaced state', function() {
      var hit = 0;

      diff.addTransitionState('replaced', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span></span></div>');

      assert.equal(hit, 1);
    });

    it('will trigger all states with element replacement', function() {
      var hit = { added: 0, replaced: 0, removed: 0 };

      diff.addTransitionState('added', function(element) { hit.added++; });
      diff.addTransitionState('removed', function(element) { hit.removed++; });
      diff.addTransitionState('replaced', function(element) {
        hit.replaced++;
      });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.innerHTML(this.fixture, '<div><span></span></div>');

      assert.equal(hit.added, 2, 'Added is triggered for p and span');
      assert.equal(hit.removed, 1, 'Removed is only triggered for p');
      assert.equal(hit.replaced, 1, 'Replaced is only triggered for span');
    });
  });

  describe('Removing states', function() {
    it('can remove all states', function() {
      var hit = 0;

      diff.addTransitionState('added', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState();
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      assert.equal(hit, 1);
    });

    it('can remove all states by name', function() {
      var hit = 0;

      diff.addTransitionState('added', function(element) { hit++; });
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState('added');
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      assert.equal(hit, 1);
    });

    it('can remove state by name and callback reference', function() {
      var hit = 0;

      function addedState(element) { hit++; }

      diff.addTransitionState('added', addedState);
      diff.innerHTML(this.fixture, '<div><p></p></div>');
      diff.removeTransitionState('added', addedState);
      diff.innerHTML(this.fixture, '<div><p></p><p></p></div>');

      assert.equal(hit, 1);
    });
  });
});
