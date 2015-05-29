var pools = exports;
var uuid = require('./uuid');

function createPool(size, name, fill) {
  var free = [];
  var allocated = [];
  var index = new WeakMap();

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    _free: free,
    _allocated: allocated,

    get: function() {
      var obj = null;
      var freeLength = free.length;
      var minusOne = freeLength - 1;

      if (freeLength) {
        obj = free[minusOne];
        free.length = minusOne;
      }
      else {
        obj = fill();
      }

      var idx = allocated.push(obj);

      if (typeof obj === 'string') {
        index[obj] = idx;
      }
      else {
        index.set(obj, idx - 1);
      }

      return obj;
    },

    freeAll: function() {
      var allocatedLength = allocated.length;

      for (var i = 0; i < allocatedLength; i++) {
        var obj = allocated[i];

        if (typeof obj === 'string') {
          var idx = index[obj];
          delete index[obj];
        }
        else {
          var idx = index.get(obj);
          // Remove from index map.
          index.delete(obj);
        }

        idx = idx || -1;

        // Already freed.
        if (idx === -1) { continue; }

        // Clean.
        if (obj.length) {
          obj.length = 0;
        }
        else {
          for (var key in obj) {
            obj[key] = void 0;
          }
        }

        // Only put back into the free queue if we're under the size.
        free.push(obj);
      }

      allocated.length = 0;
    },

    free: function(obj) {
      if (typeof obj === 'string') {
        var idx = index[obj];
        delete index[obj];
      }
      else {
        var idx = index.get(obj);
        // Remove from index map.
        index.delete(obj);
      }

      idx = idx || -1;

      // Already freed.
      if (idx === -1) { return; }

      // Clean.
      if (obj.length) {
        obj.length = 0;
      }
      else {
        for (var key in obj) {
          obj[key] = void 0;
        }
      }

      // Only put back into the free queue if we're under the size.
      if (free.length < size) {
        free.push(obj);
      }

      allocated.splice(idx, 1);
    }
  };
}


function initializePools(COUNT) {
  pools.object = createPool(COUNT, 'object', function() {
    return {};
  });

  pools.array = createPool(COUNT, 'array', function() {
    return [];
  });

  pools.uuid = createPool(COUNT, 'uuid', function() {
    return uuid();
  });
}

exports.create = createPool;
exports.initialize = initializePools;
