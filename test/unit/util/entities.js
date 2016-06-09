import { decodeEntities } from '../../../lib/util/entities';

describe('Unit: DecodeEntities', function() {
  it('can decode an unencoded string', function() {
    var string = decodeEntities('&lt;p&gt;&lt;/p&gt;');

    assert.equal(string, '<p></p>');
  });

  it('can decode an HTML5 encoded string', function() {
    var string = decodeEntities(`&gla;`);
    assert.equal(string, '⪥');
  });
});
