describe('Element.prototype.diffhtml', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
  });

  describe('Basics', function() {
    it('exists on Element prototype', function() {
      assert('diffHTML' in Element.prototype);
    });

    it('errors when a non-string type is passed', function() {
      var test = this;

      assert.throws(function() {
        test.fixture.diffHTML = null;
      });

      assert.throws(function() {
        test.fixture.diffHTML = {};
      });

      assert.throws(function() {
        test.fixture.diffHTML = 55;
      });
    });

    it('will accept a string argument', function() {
      var test = this;

      assert.doesNotThrow(function() {
        test.fixture.diffHTML = 'testing';
      });

      assert.equal(test.fixture.firstChild.nodeName, 'SPAN');
      assert.equal(test.fixture.firstChild.textContent, 'testing');
    });

    it('is set to configurable', function() {
      var des = Object.getOwnPropertyDescriptor(Element.prototype, 'diffHTML');
      assert.equal(des.configurable, true);
    });
  });


});
