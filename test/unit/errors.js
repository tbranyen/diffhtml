describe('Unit: Errors', function() {
  var errors = require('/lib/errors');

  describe('TransitionStateError', function() {
    var TransitionStateError = errors.TransitionStateError;

    it('is exported', function() {
      assert.ok(TransitionStateError);
    });

    it('is a subclass of the Error constructor', function() {
      assert.ok(new TransitionStateError() instanceof Error);
    });

    it('correctly attaches the message and stack properties', function() {
      var error = new TransitionStateError('Test');

      assert.equal(error.message, 'Test');
      assert.ok(error.stack);
    });
  });
});
