describe('Basics', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  describe('Expose API', function() {
    it('exposes diffhtml global', function() {
      assert.equal(typeof diffhtml, 'function');
    });

    it('exists on Element prototype', function() {
      assert('diffInnerHTML' in Element.prototype);
      assert('diffOuterHTML' in Element.prototype);
    });
  });

  describe('Call API', function() {
    it('will error if element is missing', function() {
      assert.throws(function() {
        diffhtml();
      });
    });

    it('will not error if markup is missing', function() {
      var test = this;

      assert.doesNotThrow(function() {
        diffhtml(test.fixture, '');
      });
    });

    it('will not error if options are missing', function() {
      var test = this;

      assert.doesNotThrow(function() {
        diffhtml(test.fixture, '<div></div>');
      });
    });
  });
});
