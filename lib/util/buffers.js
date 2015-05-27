/**
 * stringToBuffer
 *
 * @param string
 * @return
 */
exports.stringToBuffer = function stringToBuffer(string) {
  var buffer = new Uint16Array(string.length);

  for (var i = 0; i < string.length; i++) {
    buffer[i] = string.codePointAt(i);
  }

  return buffer;
};

/**
 * bufferToString
 *
 * @param buffer
 * @return
 */
exports.bufferToString = function bufferToString(buffer) {
  var tmpBuffer = new Uint16Array(buffer, 0, buffer.length);
  var string = '';

  for (var i = 0; i < tmpBuffer.length; i++) {
    string += String.fromCodePoint(tmpBuffer[i]);
  }

  return string;
};
