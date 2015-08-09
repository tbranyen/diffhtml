describe('Diff Outer HTML', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  it('cannot replace an element without a parent', function() {
    assert.throws(function() {
      diff.outerHTML(this.fixture, '<p></p>');
    });
  });

  it('can replace an element with a parent', function() {
    diff.outerHTML(this.fixture.firstChild, '<p></p>');

    assert.equal(this.fixture.firstChild.tagName, 'P');
  });

  describe('Comments', function() {
    it('ignores comments', function() {
      diff.outerHTML(this.fixture, '<div><p><!-- test --></p></div>');

      assert.equal(this.fixture.innerHTML, '<p></p>');
    });
  });

  describe('Text', function() {
    it('can be updated by directly setting', function() {
      diff.outerHTML(this.fixture, '<div>test</div>');

      assert.equal(this.fixture.textContent, 'test');

      diff.outerHTML(this.fixture, '<div>this</div>');

      assert.equal(this.fixture.textContent, 'this');
    });

    it('can replace over markup', function() {
      diff.outerHTML(this.fixture, '<div><div>test div</div></div>');
      diff.outerHTML(this.fixture, '<div>this</div>');

      assert.equal(this.fixture.innerHTML, 'this');
    });

    it('will not replace a previous span', function() {
      diff.outerHTML(this.fixture, '<div><span class="test"></span></div>');
      var span = this.fixture.querySelector('.test');
      diff.outerHTML(this.fixture, '<div><span>whatever</span></div>');

      assert.equal(this.fixture.innerHTML, '<span>whatever</span>');
      assert.equal(this.fixture.firstChild, span, 'are the same element');
    });
  });

  describe('Attributes', function() {
    it('can change attributes', function() {
      diff.outerHTML(this.fixture, '<div class="hello"></div>');

      assert.equal(this.fixture.className, 'hello');
    });

    it('can change attributes more than once', function() {
      diff.outerHTML(this.fixture, '<div class="hello"></div>');
      diff.outerHTML(this.fixture, '<div class="hello to you"></div>');

      assert.equal(this.fixture.className, 'hello to you');
    });

    it('supports inline styles', function() {
      diff.outerHTML(this.fixture,
        '<div><p style="font-size: 11px"></p></div>');

      assert.equal(this.fixture.innerHTML, '<p style="font-size: 11px"></p>');
    });

    describe('Data', function() {
      it('has basic support', function() {
        diff.outerHTML(this.fixture, '<div><p data-test="test2"></p></div>');

        assert.equal(this.fixture.innerHTML, '<p data-test="test2"></p>');
      });

      it('can handle dash separated properties', function() {
        diff.outerHTML(this.fixture,
          '<div><p data-test-two="test2"></p></div>');

        assert.equal(this.fixture.innerHTML, '<p data-test-two="test2"></p>');
      });
    });
  });
});
