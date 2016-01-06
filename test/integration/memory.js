describe('Integration: Memory management', function() {
  var pools = require('/lib/util/pools').pools;
  var nodes = require('/lib/node/make');

  var cleanMemory = require('/lib/util/memory').cleanMemory;
  var makeNode = require('/lib/node/make');

  // Useful for console debugging.
  window.pools = pools;
  window.nodes = nodes;
  window.cleanMemory = cleanMemory;
  window.makeNode = makeNode;

  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();
  });

  it('can allocate/deallocate uuids', function() {
    diff.innerHTML(this.fixture, '<p></p>');
    assert.equal(Object.keys(pools.elementObject._uuid).length, 2);

    diff.innerHTML(this.fixture, '');
    assert.equal(Object.keys(pools.elementObject._uuid).length, 1);
  });
});
