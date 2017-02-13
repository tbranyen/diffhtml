assert.compareObjects = function(actual, expected) {
  var output = diffJSON.diffString(actual, expected);

  if (output && output !== 'undefined') {
    console.log(output);
    throw new Error('Actual does not match expected');
  }
};
