describe('diffOuterHTML', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  it('cannot replace an element without a parent', function() {
    assert.throws(function() {
      diffhtml(this.fixture, '<p></p>');
    });
  });

  it('can replace an element with a parent', function() {
    diffhtml(this.fixture.firstChild, '<p></p>');

    assert.equal(this.fixture.firstChild.tagName, 'P');
  });

  describe('Top level elements', function() {
    it('can change attributes', function() {
      diffhtml(this.fixture, '<div class="hello"></div>');

      assert.equal(this.fixture.className, 'hello');
    });

    it('can change attributes more than once', function() {
      diffhtml(this.fixture, '<div class="hello"></div>');
      diffhtml(this.fixture, '<div class="hello to you"></div>');

      assert.equal(this.fixture.className, 'hello to you');
    });
  });
});
