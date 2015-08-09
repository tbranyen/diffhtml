describe.skip('Transitions', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  describe('Replace', function() {
    it('will error if element is missing', function() {
      assert.throws(function() {
        diffhtml();
      });
    });
  });
});
