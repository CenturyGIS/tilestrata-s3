'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tileliveS = require('@mapbox/tilelive-s3');

var _tileliveS2 = _interopRequireDefault(_tileliveS);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _intersect = require('@turf/intersect');

var _intersect2 = _interopRequireDefault(_intersect);

var _conversions = require('./conversions');

var _defaults = require('./defaults');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var S3Cache = function () {

  /**
   * S3Cache Constructor
   *
   * @param  {object} options
   * @param  {string|object} options.uri,
   * @param  {Buffer}        options.emptyBuffer
   * @param  {object}        [options.extent] any GeoJSON object
   * @param  {number}        [options.minZoom]
   * @param  {number}        [options.maxZoom]
   */
  function S3Cache(options) {
    _classCallCheck(this, S3Cache);

    var empty = options.interactivity ? JSON.stringify(_defaults.emptyGrid) : _defaults.emptyTile;

    this.options = _.defaults(options, {
      emptyBuffer: options.emptyBuffer || new Buffer(empty, 'utf8')
      // minZoom: options.minZoom || 0,
      // maxZoom: options.maxZoom || 18,
    });
  }

  _createClass(S3Cache, [{
    key: 'init',
    value: function init(server, callback) {
      var _this = this;

      return new _tileliveS2.default(this.options.uri, function (err, src) {
        _this.source = src;
        callback(err);
      });
    }
  }, {
    key: 'get',
    value: function get(server, req, callback) {
      var _this2 = this;

      var getTileFn = this.options.interactivity ? this.source.getGrid : this.source.getTile;

      getTileFn.call(this.source, req.z, req.x, req.y, function (err, buffer, headers) {
        if (err) {
          var notRetryable = typeof err.retryable === 'boolean' && !err.retryable;
          if (notRetryable && _this2.options.extent) {
            var tilePolygon = (0, _conversions.getTilePolygon)(req.z, req.x, req.y);
            var overlaps = (0, _intersect2.default)(tilePolygon, _this2.options.extent);
            if (!overlaps) {
              return callback(null, _this2.options.emptyBuffer, _.clone(headers));
            }
          }
          return callback(err);
        }
        callback(err, buffer, _.clone(headers));
      });
    }
  }, {
    key: 'set',
    value: function set(server, tile, buffer, headers, callback) {
      this.source.putTile(tile.z, tile.x, tile.y, buffer, function (err) {
        if (err) {
          return callback(err);
        }
        callback(err, buffer, _.clone(headers));
      });
    }
  }]);

  return S3Cache;
}();

exports.default = S3Cache;