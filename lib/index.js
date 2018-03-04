'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TilestrataS3 = TilestrataS3;

var _s3Cache = require('./s3-cache');

var _s3Cache2 = _interopRequireDefault(_s3Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TilestrataS3(options) {
  return new _s3Cache2.default(options);
}