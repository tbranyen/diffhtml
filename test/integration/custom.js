describe('Integration: Custom Elements', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
  });

  it('can register an element', function() {
    var callbackTriggered = false;

    diff.registerElement('custom-element', {
      constructor: function() {
        callbackTriggered = true;
      }
    });

    diff.innerHTML(this.fixture, '<custom-element></custom-element>');

    assert.ok(callbackTriggered, 'constructor was called');
  });

  it('cannot register over an existing component', function() {
    diff.registerElement('custom-element-two', {});

    assert.throws(function() {
      diff.registerElement('custom-element-two', {});
    });
  });

  it('can trigger the createdCallback', function() {
    var callbackTriggered = false;

    diff.registerElement('custom-element-three', {
      createdCallback: function() {
        callbackTriggered = true;
      }
    });

    diff.innerHTML(this.fixture, '<custom-element-three></custom-element-three>');

    assert.ok(callbackTriggered, 'createdCallback was called');
  });

  it('can trigger the attachedCallback', function() {
    var callbackTriggered = false;

    diff.registerElement('custom-element-four', {
      attachedCallback: function() {
        callbackTriggered = true;
      }
    });

    diff.innerHTML(this.fixture, '<custom-element-four></custom-element-four>');

    assert.ok(callbackTriggered, 'attachedCallback was called');
  });
});
