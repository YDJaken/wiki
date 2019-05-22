**ST_GeomFromGeoJSON**  geoJSON转换为geom对象
```
geometry ST_GeomFromGeoJSON(text geomjson);
```


**ST_AsGeoJSON**  geom对象转换为geoJSON
```
text ST_AsGeoJSON(geometry geom, integer maxdecimaldigits=15, integer options=0);

text ST_AsGeoJSON(geography geog, integer maxdecimaldigits=15, integer options=0);


Return the geometry as a GeoJSON element. (Cf GeoJSON specifications 1.0). 2D and 3D Geometries are both supported. GeoJSON only support SFS 1.1 geometry type (no curve support for example).

The gj_version parameter is the major version of the GeoJSON spec. If specified, must be 1. This represents the spec version of GeoJSON.

The third argument may be used to reduce the maximum number of decimal places used in output (defaults to 15). If you are using EPSG:4326 and are outputting the geometry only for display, maxdecimaldigits=6 can be a good choice for many maps.

The last options argument could be used to add BBOX or CRS in GeoJSON output:

0: means no option (default value)

1: GeoJSON BBOX

2: GeoJSON Short CRS (e.g EPSG:4326)

4: GeoJSON Long CRS (e.g urn:ogc:def:crs:EPSG::4326)

Version 1: ST_AsGeoJSON(geom) / maxdecimaldigits=15 version=1 options=0

Version 2: ST_AsGeoJSON(geom, maxdecimaldigits) / version=1 options=0

Version 3: ST_AsGeoJSON(geom, maxdecimaldigits, options) / version=1

Version 4: ST_AsGeoJSON(gj_version, geom) / maxdecimaldigits=15 options=0

Version 5: ST_AsGeoJSON(gj_version, geom, maxdecimaldigits) / options=0

Version 6: ST_AsGeoJSON(gj_version, geom, maxdecimaldigits, options)
```
