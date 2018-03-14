import S3Backend from '@mapbox/tilelive-s3';
import * as _ from 'lodash';
import intersect from '@turf/intersect';
import { getTilePolygon } from './conversions';
import { emptyGrid, emptyTile } from './defaults';

export default class S3Cache {

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
  constructor(options) {
    const empty = options.interactivity ? JSON.stringify(emptyGrid) : emptyTile;
    this.options = _.defaults(options, {
      emptyBuffer: options.emptyBuffer || new Buffer(empty, 'utf8')
      // minZoom: options.minZoom || 0,
      // maxZoom: options.maxZoom || 18,
    });
  }

  init (server, callback) {
    return new S3Backend(this.options.uri, (err, src) => {
      this.source = src;
      callback(err);
    });
  }

  get (server, req, callback) {
    this.source.getTile(req.z, req.x, req.y, (err, buffer, headers) => {
      if (err) {
        const notRetryable = typeof(err.retryable) === 'boolean' && !err.retryable;
        if (notRetryable && this.options.extent) {
          const tilePolygon = getTilePolygon(req.z, req.x, req.y);
          const overlaps = intersect(tilePolygon, this.options.extent);
          if (!overlaps) {
            return callback(null, this.option.emptyBuffer, _.clone(headers));
          }
        }
        return callback(err);
      }
      callback(err, buffer, _.clone(headers));
    });
  }

  set (server, tile, buffer, headers, callback) {
    this.source.putTile(tile.z, tile.x, tile.y, buffer, (err) => {
      if (err) {
        return callback(err);
      }
      callback(err, buffer, _.clone(headers));
    });
  }
}
