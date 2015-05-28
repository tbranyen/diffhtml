describe('Element.prototype.diffhtml', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
  });

  describe('Basics', function() {
    it('exists on Element prototype', function() {
      assert('innerDiffHTML' in Element.prototype);
      assert('outerDiffHTML' in Element.prototype);
    });

    it('errors when a non-string type is passed', function() {
      var test = this;

      assert.throws(function() {
        test.fixture.innerDiffHTML = null;
      });

      assert.throws(function() {
        test.fixture.innerDiffHTML = {};
      });

      assert.throws(function() {
        test.fixture.innerDiffHTML = 55;
      });
    });

    it('will accept a string argument', function() {
      var test = this;

      assert.doesNotThrow(function() {
        test.fixture.innerDiffHTML = 'testing';
      });

      assert.equal(test.fixture.firstChild.nodeName, 'SPAN');
      assert.equal(test.fixture.firstChild.textContent, 'testing');
    });

    it('is set to configurable', function() {
      var des = Object.getOwnPropertyDescriptor(Element.prototype, 'innerDiffHTML');
      assert.equal(des.configurable, true);
    });
  });

  describe('Text', function() {
    it('can be updated by directly setting', function() {
      this.fixture.innerDiffHTML = 'test';
      assert.equal(this.fixture.textContent, 'test');

      this.fixture.innerDiffHTML = 'this';
      assert.equal(this.fixture.textContent, 'this');
    });

    it('can replace over markup', function() {
      this.fixture.innerHTML = '<div>test div</div>';
      this.fixture.innerDiffHTML = 'this';
      assert.equal(this.fixture.innerHTML, '<span>this</span>');
    });

    it('will not replace a previous span', function() {
      this.fixture.innerDiffHTML = '<span class="test"></span>';
      var span = this.fixture.querySelector('.test');
      this.fixture.innerDiffHTML = 'whatever';

      assert.equal(this.fixture.innerHTML, '<span class="">whatever</span>');
      assert.equal(this.fixture.firstChild, span, 'are the same element');
    });
  });

  describe('Top level elements', function() {
    it('supports a single top level element', function() {
      this.fixture.innerDiffHTML = '<div class="test"></div>';
      this.fixture.innerDiffHTML = '<div class="whatever">steak tips</div>';

      assert.equal(this.fixture.innerHTML, '<div class="whatever">steak tips</div>');
    });

    it('supports multiple top level elements auto nested in a DIV', function() {
      this.fixture.innerDiffHTML = '<p>thing</p><div class="test"></div>';
      this.fixture.innerDiffHTML = '<div class="whatever">steak tips</div><span>just checkin</span>';

      assert.equal(this.fixture.innerHTML, '<div><div class="whatever">steak tips</div><span>just checkin</span></div>');
    });

    it('will wipe out elements if no top level element exists', function() {
      this.fixture.innerDiffHTML = '<p>thing</p><div class="test"></div>';
      this.fixture.innerDiffHTML = '';

      assert.equal(this.fixture.innerHTML, '');
    });
  });

  describe('Comments', function() {
    it('ignores comments', function() {
      this.fixture.innerDiffHTML = '<p><!-- test --></p>';

      assert.equal(this.fixture.innerHTML, '<p></p>');
    });
  });

  describe('Attributes', function() {
    it('supports inline styles', function() {
      this.fixture.innerDiffHTML = '<p style="font-size: 10px"></p>';
      this.fixture.innerDiffHTML = '<p style="font-size: 11px"></p>';

      assert.equal(this.fixture.innerHTML, '<p style="font-size: 11px; "></p>');
    });

    describe('Data', function() {
      it('has basic support', function() {
        this.fixture.innerDiffHTML = '<p data-test="test"></p>';
        this.fixture.innerDiffHTML = '<p data-test="test2"></p>';

        assert.equal(this.fixture.innerHTML, '<p data-test="test2"></p>');
      });

      it('can handle dash separated properties', function() {
        this.fixture.innerDiffHTML = '<p data-test-two="test"></p>';
        this.fixture.innerDiffHTML = '<p data-test-two="test2"></p>';

        assert.equal(this.fixture.innerHTML, '<p data-test-two="test2"></p>');
      });
    });
  });
});
