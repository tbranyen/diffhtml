import * as diff from '../../lib/index';
import validateMemory from '../util/validateMemory';

describe('Integration: Middleware', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    if (this.unset) {
      this.unset();
    }

    validateMemory();
  });

  it('cannot be any type other than function', function() {
    assert.throws(function() {
      diff.use('hello');
    });

    assert.throws(function() {
      diff.use(1);
    });

    assert.throws(function() {
      diff.use(null);
    });

    assert.throws(function() {
      diff.use({});
    });
  });

  it('can register middleware and pass the new HTML arg', function() {
    var actual = null;

    this.unset = diff.use(({ newHTML }) => {
      actual = newHTML;
    });

    diff.innerHTML(this.fixture, '<div></div>');

    assert.equal(actual, '<div></div>');
  });

  it('will call middleware just before syncing', function() {
    var options = null;

    this.unset = diff.use(() => _options => {
      options = _options;
    });

    diff.innerHTML(this.fixture, '<div></div>');

    assert.deepEqual(Object.keys(options), [
      'oldTree',
      'newTree',
      'transactionMethods',
    ]);
  });

  it('will call middleware right after patching', function() {
    var options = null;

    this.unset = diff.use(startDate => () => (_options) => {
      options = _options;
    });

    diff.innerHTML(this.fixture, '<div></div>');

    assert.deepEqual(Object.keys(options), [
      'patches',
      'promises',
    ]);
  });

  it('will wait until rendering completes to trigger the fn', function(done) {
    this.unset = diff.use(startDate => () => () => () => {
      done();
    });

    diff.addTransitionState('attached', () => new Promise(resolve => {
      setTimeout(resolve, 10);
    }));

    diff.innerHTML(this.fixture, '<div></div>');
  });

  it('will call the unsubscribe middleware method when removed', function(done) {
    function middleware() {}
    middleware.unsubscribe = done;
    this.unset = diff.use(middleware);

    this.unset();
  });
});
