describe('Integration: SVG', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<svg></svg>';
    this.namespace = 'http://www.w3.org/2000/svg';
  });

  afterEach(function() {
    diff.release(this.fixture);
  });

  describe('Support', function() {
    it('can create SVG elements', function() {
      diff.innerHTML(this.fixture, '<g id="test"></g>');

      assert.equal(this.fixture.firstChild.namespaceURI, this.namespace);
    });

    // FIXME Unfortunately this breaks a lot of test cases I've seen. Need to
    // do more research into when to namespace the SVG attributes.
    //it('can set an SVG attribute', function() {
    //  diff.innerHTML(this.fixture, '<g id="test"></g>');
    //  diff.innerHTML(this.fixture, '<g id="this"></g>');

    //  var firstChild = this.fixture.firstChild;

    //  assert.equal(firstChild.attributes[0].namespaceURI, this.namespace);
    //});
  });
});
