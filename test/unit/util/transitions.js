import { states as transitionStates } from '../../../lib/util/transitions';

describe('Unit: Transitions', function() {
  it('exports arrays to store callbacks in', function() {
    assert.ok(Array.isArray(transitionStates.attached));
    assert.ok(Array.isArray(transitionStates.detached));
    assert.ok(Array.isArray(transitionStates.replaced));
    assert.ok(Array.isArray(transitionStates.attributeChanged));
    assert.ok(Array.isArray(transitionStates.textChanged));
  });
});
