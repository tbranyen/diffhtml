describe.skip('diffhtml', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
  });

  describe('Basics', function() {
    it('errors when a non-string type is passed', function() {
      var test = this;

      assert.throws(function() {
        test.fixture.diffInnerHTML = null;
      });

      assert.throws(function() {
        test.fixture.diffInnerHTML = {};
      });

      assert.throws(function() {
        test.fixture.diffInnerHTML = 55;
      });
    });

    // FIXME This is weird behavior.
    it.skip('will accept a string argument', function() {
      var test = this;

      assert.doesNotThrow(function() {
        test.fixture.diffInnerHTML = 'testing';
      });

      assert.equal(test.fixture.firstChild.nodeName, 'SPAN');
      assert.equal(test.fixture.firstChild.textContent, 'testing');
    });

    it('is set to configurable', function() {
      var des = Object.getOwnPropertyDescriptor(Element.prototype, 'diffInnerHTML');
      assert.equal(des.configurable, true);
    });
  });

  // FIXME Weird behavior.
  describe.skip('Text', function() {
    it('can be updated by directly setting', function() {
      this.fixture.diffInnerHTML = 'test';
      assert.equal(this.fixture.textContent, 'test');

      this.fixture.diffInnerHTML = 'this';
      assert.equal(this.fixture.textContent, 'this');
    });

    it('can replace over markup', function() {
      this.fixture.innerHTML = '<div>test div</div>';
      this.fixture.diffInnerHTML = 'this';
      assert.equal(this.fixture.innerHTML, '<span>this</span>');
    });

    it('will not replace a previous span', function() {
      this.fixture.diffInnerHTML = '<span class="test"></span>';
      var span = this.fixture.querySelector('.test');
      this.fixture.diffInnerHTML = 'whatever';

      assert.equal(this.fixture.innerHTML, '<span class="">whatever</span>');
      assert.equal(this.fixture.firstChild, span, 'are the same element');
    });
  });

  describe('Top level elements', function() {
    it('supports a single top level element', function() {
      this.fixture.diffInnerHTML = '<div class="test"></div>';
      this.fixture.diffInnerHTML = '<div class="whatever">steak tips</div>';

      assert.equal(this.fixture.innerHTML, '<div class="whatever">steak tips</div>');
    });

    it('supports multiple top level elements auto nested in a DIV', function() {
      this.fixture.diffInnerHTML = '<p>thing</p><div class="test"></div>';
      this.fixture.diffInnerHTML = '<div class="whatever">steak tips</div><span>just checkin</span>';

      assert.equal(this.fixture.innerHTML, '<div><div class="whatever">steak tips</div><span>just checkin</span></div>');
    });

    it('will wipe out elements if no top level element exists', function() {
      this.fixture.diffInnerHTML = '<p>thing</p><div class="test"></div>';
      this.fixture.diffInnerHTML = '';

      assert.equal(this.fixture.innerHTML, '');
    });
  });
});
