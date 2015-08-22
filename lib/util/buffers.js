/**
 * Converts a string to a buffer.
 *
 * @param string
 * @return {Uint16Array}
 */
export function stringToBuffer(string) {
  var buffer = new Uint16Array(string.length);

  for (var i = 0; i < string.length; i++) {
    buffer[i] = string.codePointAt(i);
  }

  return buffer;
}

/**
 * Converts a Uint16Array to a String.
 *
 * @param buffer - A Uint16Array buffer to convert.
 * @return {String}
 */
export function bufferToString(buffer) {
  var tmpBuffer = new Uint16Array(buffer, 0, buffer.length);
  var string = '';

  for (var i = 0; i < tmpBuffer.length; i++) {
    string += String.fromCodePoint(tmpBuffer[i]);
  }

  return string;
}
