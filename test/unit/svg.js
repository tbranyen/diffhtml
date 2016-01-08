import * as svg from '../../lib/svg';

describe('Unit: SVG', function() {
  it('exports a list of valid SVG elements', function() {
    assert.ok(Array.isArray(svg.elements));
    assert.ok(svg.elements.length);
  });

  it('exports the SVG namespace', function() {
    assert.equal(svg.namespace, 'http://www.w3.org/2000/svg');
  });
});
