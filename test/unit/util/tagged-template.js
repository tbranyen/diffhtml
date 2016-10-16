import { html } from '../../../lib/util/tagged-template';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';

describe('Unit: Tagged template', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  it('can interpolate a single string value in an attribute', function() {
    const foo = 'foo';

    const multipleValues = html`<span class="${foo}" />`;

    assert.equal(multipleValues.attributes[0].name, 'class');
    assert.equal(multipleValues.attributes[0].value, 'foo');
  });

  it('can interpolate multiple string values in an attribute', function() {
    const foo = 'foo';
    const bar = 'bar';

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    assert.equal(multipleValues.attributes[0].name, 'class');
    assert.equal(multipleValues.attributes[0].value, 'foo bar');
  });

  it('can interpolate multiple type values in an attribute', function() {
    const foo = 'foo';
    const bar = {};

    const multipleValues = html`<span class="${foo} ${bar}" />`;

    assert.equal(multipleValues.attributes[0].name, 'class');
    assert.equal(multipleValues.attributes[0].value, 'foo __DIFFHTML__');
  });
});
