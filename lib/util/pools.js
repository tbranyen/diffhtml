var pools = exports;

function createPool(size, fill) {
  var free = [];
  var allocated = [];

  // Prime the cache with n objects.
  for (var i = 0; i < size; i++) {
    free[i] = fill();
  }

  return {
    get: function() {
      var obj = null;

      if (free.length) {
        obj = free.pop();
      }
      else {
        obj = fill();

        // Double the amount of objects.
        for (var i = free.length; i < free.length + size; i++) {
          free[i] = fill();
        }
      }

      allocated.push(obj);
      return obj;
    },

    free: function(obj) {
      var idx = allocated.indexOf(obj);

      // Clean.
      if (Array.isArray(obj)) {
        obj.length = 0;
      }
      else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            delete obj[key];
          }
        }
      }

      free.push(obj);
      allocated.splice(idx, 1);
    }
  };
}


function initializePools(COUNT) {
  pools.object = createPool(COUNT / 2, function() {
    return {};
  });

  pools.array = createPool(COUNT, function() {
    return [];
  });
}

exports.create = createPool;
exports.initialize = initializePools;
