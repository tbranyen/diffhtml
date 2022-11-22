let nodeBuffer = null;

try {
  nodeBuffer = (await import('buffer')).default;
}
catch {}

export default nodeBuffer;
