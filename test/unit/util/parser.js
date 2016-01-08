import * as parser from '../../../lib/util/parser';

describe('Unit: Parser', function() {
  it('supports empty attributes', function() {
    var node = parser.parseHTML('<option value="test" selected></option>');

    assert.equal(node.attributes[0].name, 'value');
    assert.equal(node.attributes[0].value, 'test');
    assert.equal(node.attributes[1].name, 'selected');
  });

  it('supports quote-less values', function() {
    var node = parser.parseHTML('<option value=test></option>');

    assert.equal(node.attributes[0].name, 'value');
    assert.equal(node.attributes[0].value, 'test');
  });
});
