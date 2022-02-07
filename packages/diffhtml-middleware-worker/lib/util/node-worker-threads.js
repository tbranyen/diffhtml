let nodeWorkerThreads = null;

try {
  nodeWorkerThreads = (await import('worker_threads')).default;
}
catch {}

export default nodeWorkerThreads;
