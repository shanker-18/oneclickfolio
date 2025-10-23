// Dynamic import of ES module server
let appPromise;

module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = import('../server/index.js').then(module => module.default);
  }
  
  const app = await appPromise;
  return app(req, res);
};
