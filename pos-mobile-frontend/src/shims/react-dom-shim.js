// Shim for react-dom — only needed because @clerk/clerk-react imports
// a web-only portal utility. That code path is never executed in React Native,
// so exporting empty stubs is safe.
module.exports = {
  createPortal: () => null,
  flushSync:    (fn) => fn(),
};
