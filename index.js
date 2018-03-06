const S3Cache = require('./lib').default;

module.exports = function (options) {
  return new S3Cache(options);
};
