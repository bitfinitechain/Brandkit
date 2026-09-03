// next/link (imported by Footer) reads process.env.__NEXT_* at module scope,
// and a browser has no `process`. Bundled first via cfg.extraEntries.
//
// The side effect hangs off an EXPORTED binding on purpose: the generated
// .bundle-entry.mjs re-exports each extra entry with `export * from`, and a
// module that exports nothing gets tree-shaken away before it can run.
export const __dsProcessShim = (() => {
  const g = globalThis;
  if (typeof g.process === 'undefined') g.process = { env: {} };
  else if (!g.process.env) g.process.env = {};
  return true;
})();
