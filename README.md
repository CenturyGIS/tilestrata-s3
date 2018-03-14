# tilestrata-s3

A [TileStrata](https://github.com/naturalatlas/tilestrata) plugin for storing / retrieving tiles from S3.

## Sample Usage

```js
var s3 = require('tilestrata-s3');

server.layer('mylayer').route('tile.png')
  .use(/* some provider */)
  .use(s3({
    uri: 's3://mybucket/mylayer/png/{z}/{x}/{y}',
  }));
```

## Advanced Usage

```js
var s3 = require('tilestrata-s3');

// use an extent polygon to prevent caching irrelevant tiles
server.layer('mylayer').route('tile.json')
  .use(/* some provider */)
  .use(s3({
    uri: 's3://mybucket/mylayer/png/{z}/{x}/{y}',
    extent: someGeoJson,
  }));

// use a buffer to render empty tile when extent GeoJSON is used (defaults to
// empty 256 png or empty UTF grid JSON if interactivity is true)
server.layer('mylayer').route('tile.png')
  .use(/* some provider */)
  .use(s3({
    uri: 's3://mybucket/mylayer/png/{z}/{x}/{y}',
    extent: someGeoJson,
    emptyBuffer: new Buffer(/* some base64 encoded object */, 'utf8')
  }));

// if interactivity is true, will render empty UTF grids if outside of extent
// polygon - instead of supplying the `emptyBuffer`
server.layer('mylayer').route('tile.json')
  .use(/* some provider */)
  .use(s3({
    uri: 's3://mybucket/mylayer/grid/{z}/{x}/{y}',
    extent: someGeoJson,
    interactivity: true,
  }));


```
