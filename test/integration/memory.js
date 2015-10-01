describe('Memory management', function() {
  var pools = require('/lib/util/pools');

  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  it('can allocate/deallocate uuids', function() {
    diff.innerHTML(this.fixture, '<p></p>');
    assert.equal(pools.pools.elementObject._uuid.length, 2);

    diff.innerHTML(this.fixture, '');
    assert.equal(pools.pools.elementObject._uuid.length, 1);
  });
});
