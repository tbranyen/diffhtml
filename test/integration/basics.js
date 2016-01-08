import * as diff from '../../lib/index.js';

describe('Integration: Basics', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();
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
      var doc = document.implementation.createHTMLDocument();

      doc.open();
      doc.write('<html><head><title></title></head></html>');

      var documentElement = doc.documentElement;
      diff.outerHTML(documentElement, '<html><head><title>Test</title></head></html>');

      assert.equal(doc.title, 'Test');

      diff.release(documentElement);
      doc.close();
    });

    // This is not properly tested.
    describe('Web Worker', function() {
      it('supports basic usage', function(done) {
        diff.innerHTML(this.fixture, '<div class="test">this</div>');

        this.fixture.addEventListener('renderComplete', function() {
          try {
            assert.equal(this.firstChild.getAttribute('class'), 'test2');
            assert.equal(this.firstChild.textContent, 'this2');
          }
          catch (ex) {
            done(ex);
          }
          finally {
            done();
          }
        });

        diff.innerHTML(this.fixture, '<div class="test2">this2</div>', {
          enableWorker: true
        });
      });

      it('can track simple state', function(done) {
        var count = 0;

        this.fixture.addEventListener('renderComplete', function() {
          count++;

          if (count === 2) {
            try {
              assert.equal(this.firstChild.getAttribute('class'), 'test2');
              assert.equal(this.firstChild.textContent, 'this2');
            }
            catch (ex) {
              done(ex);
            }
            finally {
              done();
            }
          }
        });

        diff.innerHTML(this.fixture, '<div class="test"><p>this</p></div>', {
          enableWorker: true
        });

        diff.innerHTML(this.fixture, '<div class="test2"><p>this2</p></div>', {
          enableWorker: true
        });
      });

      it('can track medium-complex state', function(done) {
        var count = 0;

        this.fixture.addEventListener('renderComplete', function() {
          count++;

          switch (count) {
            case 3: {
              assert.equal(this.fixture.childNodes[0].nodeName, 'P');
              assert.equal(this.fixture.childNodes[0].className, '1');

              assert.equal(this.fixture.childNodes[1].nodeName, 'P');
              assert.equal(this.fixture.childNodes[1].className, '3');

              assert.equal(this.fixture.childNodes[2].nodeName, 'P');
              assert.equal(this.fixture.childNodes[2].className, '2');

              done();
              break;
            }

            case 1: {
              assert.equal(this.fixture.childNodes[0].nodeName, 'P');
              assert.equal(this.fixture.childNodes[0].className, '1');

              assert.equal(this.fixture.childNodes[1].nodeName, 'P');
              assert.equal(this.fixture.childNodes[1].className, '2');

              assert.equal(this.fixture.childNodes[2].nodeName, 'P');
              assert.equal(this.fixture.childNodes[2].className, '3');
              break;
            }
            case 2: {
              assert.equal(this.fixture.childNodes[0].nodeName, 'P');
              assert.equal(this.fixture.childNodes[0].className, '1');

              assert.equal(this.fixture.childNodes[1].nodeName, 'P');
              assert.equal(this.fixture.childNodes[1].className, '3');
            }
            default: {
              diff.innerHTML(this.fixture, '<p class=1></p><p class=3></p><p class=2></p>', {
                enableWorker: true
              });
            }
          }
        }.bind(this));

        diff.innerHTML(this.fixture, '<p class=1></p><p class=2></p><p class=3></p>', {
          enableWorker: true
        });

        diff.innerHTML(this.fixture, '<p class=1></p><p class=3></p>', {
          enableWorker: true
        });
      });

      it('can track very-complex state', function(done) {
        var count = 0;
        var tagNames = ['p', 'strong', 'div', 'span'];

        var makePs = function(count) {
          var elements = [];
          var tagName = tagNames[Math.floor(Math.random() * tagNames.length)];

          for (var i = 0; i < count; i++) {
            elements.push('<' + tagName + ' class="' + (Math.random() * count)
              + '"></' + tagName + '>');
          }

          return elements.join('\n');
        };

        this.fixture.addEventListener('renderComplete', function() {
          count++;

          if (count === 3) {
            assert.equal(this.fixture.childNodes.length, 100);
            done();
          }
          else if (count === 1) {
            assert.equal(this.fixture.childNodes.length, 1000);

            diff.innerHTML(this.fixture, makePs(10), {
              enableWorker: false
            });

            diff.innerHTML(this.fixture, makePs(100), {
              enableWorker: false
            });
          }
        }.bind(this));

        diff.innerHTML(this.fixture, makePs(1000), {
          enableWorker: true
        });
      });
    });
  });

  describe('Custom elements', function() {
    it('supports the use of custom elements', function() {
      diff.innerHTML(this.fixture, '<custom-element></custom-element>');

      assert.ok(this.fixture.querySelector('custom-element'));
    });
  });
});
