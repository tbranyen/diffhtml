import globalThis from './util/global';
import nodeBuffer from './util/node-buffer';

let Blob = globalThis.Blob;

// First attempt to load using Node.js
if (typeof Blob === 'undefined' && nodeBuffer) {
  Blob = nodeBuffer.Blob;
}

// If still not available, throw an error.
if (typeof Blob === 'undefined') {
  throw new Error('Missing required Blob dependency');
}

// Extract UUID from object URL generated for an arbitrary blob.
export const getUUID = () => URL.createObjectURL(new Blob()).slice(31);
