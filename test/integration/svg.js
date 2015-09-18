describe('SVG', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTMLHTML = '<svg></svg>';
    this.namespace = 'http://www.w3.org/2000/svg';
  });

  describe('Support', function() {
    it('can create SVG elements', function() {
      diff.innerHTML(this.fixture, '<g id="test"></g>');

      assert.equal(this.fixture.firstChild.namespaceURI, this.namespace);
    });

    it('can set an SVG attribute', function() {
      diff.innerHTML(this.fixture, '<g id="test"></g>');
      diff.innerHTML(this.fixture, '<g id="this"></g>');

      var firstChild = this.fixture.firstChild;

      assert.equal(firstChild.attributes[0].namespaceURI, this.namespace);
    });
  });
});
