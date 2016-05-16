import * as parser from '../../../lib/util/parser';

describe('Unit: Parser', function() {
  it('supports empty attributes', function() {
    var node = parser.parse('<option value="test" selected></option>').childNodes[0];

    assert.equal(node.attributes[0].name, 'value');
    assert.equal(node.attributes[0].value, 'test');
    assert.equal(node.attributes[1].name, 'selected');
  });

  it('supports quote-less values', function() {
    var node = parser.parse('<option value=test></option>').childNodes[0];

    assert.equal(node.attributes[0].name, 'value');
    assert.equal(node.attributes[0].value, 'test');
  });

  it('does not parse whitespace from inside <html></html> tags', function() {
    var node = parser.parse('<html>\n</html>').childNodes[0];

    assert.equal(node.childNodes.length, 2);
  });

  it('will move elements found between the ends of body and html', function() {
    var node = parser.parse(`
      <html>
        <body></body>
        <script></script>
      </html>
    `).childNodes[0];

    assert.equal(node.childNodes.length, 2);
    assert.equal(node.childNodes[0].nodeName, 'head');
    assert.equal(node.childNodes[0].childNodes.length, 0);
    assert.equal(node.childNodes[1].nodeName, 'body');
    assert.equal(node.childNodes[1].childNodes.length, 1);
    assert.equal(node.childNodes[1].childNodes[0].nodeName, 'script');
  });

  it('will move elements found before or after head and before body', function() {
    var node = parser.parse(`
      <html>
        <script>test</script>
        <head></head>
        <script>this</script>
        <body></body>
        <p></p>
      </html>
    `).childNodes[0];

    assert.equal(node.childNodes.length, 2);
    assert.equal(node.childNodes[0].nodeName, 'head');
    assert.equal(node.childNodes[0].childNodes.length, 2);
    assert.equal(node.childNodes[0].childNodes[0].nodeName, 'script');
    assert.equal(node.childNodes[0].childNodes[0].childNodes[0].nodeValue, 'test');
    assert.equal(node.childNodes[0].childNodes[1].childNodes[0].nodeValue, 'this');
    assert.equal(node.childNodes[1].nodeName, 'body');
    assert.equal(node.childNodes[1].childNodes.length, 1);
    assert.equal(node.childNodes[1].childNodes[0].nodeName, 'p');
  });

  it('cannot support brackets in attribute values', function() {
    var node = parser.parse(`<a data-text="<li class='test'></li>"></a>`).childNodes[0];

    assert.equal(node.nodeName, 'a');
    assert.equal(node.attributes[0].name, 'data-text');
    assert.equal(node.attributes[0].value,  '\"<li');
  });
});
