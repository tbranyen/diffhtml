describe('diff.innerHTML', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  it('can replace an element with a parent', function() {
    diff.innerHTML(this.fixture, '<p></p>');

    assert.equal(this.fixture.firstChild.tagName, 'P');
  });
});
