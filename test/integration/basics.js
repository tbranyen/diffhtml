describe('Basics', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTMLHTML = '<div></div>';
  });

  describe('Expose API', function() {
    it('exposes diffhtml global', function() {
      assert.equal(typeof diff, 'object');
    });

    it('exists on Element prototype', function() {
      assert(!('diffInnerHTML' in Element.prototype));
      assert(!('diffOuterHTML' in Element.prototype));

      diff.enableProllyfill();

      assert('diffInnerHTML' in Element.prototype);
      assert('diffOuterHTML' in Element.prototype);
    });
  });

  describe('Call API', function() {
    it('will error if element is missing', function() {
      assert.throws(function() {
        diff.innerHTML();
      });

      assert.throws(function() {
        diff.outerHTML();
      });
    });

    it('will not error if markup is missing', function() {
      var test = this;

      assert.doesNotThrow(function() {
        diff.outerHTML(test.fixture, '');
      });

      assert.doesNotThrow(function() {
        diff.innerHTML(test.fixture, '');
      });
    });

    it('will not error if options are missing', function() {
      var test = this;

      assert.doesNotThrow(function() {
        diff.outerHTML(test.fixture, '<div></div>');
      });

      assert.doesNotThrow(function() {
        diff.innerHTML(test.fixture, '<div></div>');
      });
    });
  });

  describe('Special features', function() {
    it('can modify the document\'s title', function() {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      var iframeDoc = iframe.contentDocument;
      var documentElement = iframeDoc.documentElement;

      diff.outerHTML(documentElement, '<html><head><title>Test</title></head></html>');
      assert.equal(iframeDoc.title, 'Test');

      iframe.parentNode.removeChild(iframe);
    });

    it('utilize a WebWorker', function(done) {
      diff.innerHTML(this.fixture, '<div class="test">this</div>', {
        enableWorker: true
      });

      // Takes
      diff.innerHTML(this.fixture, '<div class="test2">this2</div>', {
        enableWorker: true
      });

      var fixture = this.fixture;

      setTimeout(function() {
        try {
          assert.equal(fixture.firstChild.getAttribute('class'), 'test2');
          assert.equal(fixture.firstChild.textContent, 'this2');
        }
        catch (ex) {
          done(ex);
        }
        finally {
          done();
        }
      }, 250);
    });
  });
});
