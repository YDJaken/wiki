## File extensions and MIME types

3D Tiles uses the following file extensions and MIME types.

* Tileset files use the `.json` extension and the `application/json` MIME type.
* Tile content files use the file type and MIME format specific to their [tile format specification](#tile-format-specifications).
* Tileset style files use the `.json` extension and the `application/json` MIME type.

Explicit file extensions are optional. Valid implementations may ignore it and identify a content's format by the `magic` field in its header.

## JSON encoding

3D Tiles has the following restrictions on JSON formatting and encoding.

  1. JSON must use UTF-8 encoding without BOM(Browser Object Model 浏览器对象模型).
  2. All strings defined in this spec (properties names, enums) use only ASCII charset and must be written as plain text.
  3. Names (keys) within JSON objects must be unique, i.e., duplicate keys aren't allowed.

## URIs

3D Tiles uses URIs to reference tile content. These URIs may point to [relative external references (RFC3986)](https://tools.ietf.org/html/rfc3986#section-4.2) or be data URIs that embed resources in the JSON. Embedded resources use [the "data" URI scheme (RFC2397)](https://tools.ietf.org/html/rfc2397).

When the URI is relative, its base is always relative to the referring tileset JSON file.

Client implementations are required to support relative external references and embedded resources. Optionally, client implementations may support other schemes (such as `http://`). All URIs must be valid and resolvable.

## Units

The unit for all linear distances is meters.

All angles are in radians.

## Coordinate reference system (CRS)

3D Tiles uses a right-handed Cartesian coordinate system; that is, the cross product of _x_ and _y_ yields _z_. 3D Tiles defines the _z_ axis as up for local Cartesian coordinate systems. A tileset's global coordinate system will often be in a [WGS 84](http://earth-info.nga.mil/GandG/publications/tr8350.2/wgs84fin.pdf) earth-centered, earth-fixed (ECEF) reference frame, but it doesn't have to be, e.g., a power plant may be defined fully in its local coordinate system for use with a modeling tool without a geospatial context.

An additional [tile transform](#tile-transform) may be applied to transform a tile's local coordinate system to the parent tile's coordinate system.

The [region](#region) bounding volume specifies bounds using a geographic coordinate system (latitude, longitude, height), specifically [EPSG 4979](http://spatialreference.org/ref/epsg/4979/).

### glTF

Some tile content types such as [Batched 3D Model](TileFormats/Batched3DModel/README.md) and [Instanced 3D Model](TileFormats/Instanced3DModel/README.md) embed glTF. The [glTF specification](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#coordinate-system-and-units) defines a right-handed coordinate system with the _y_ axis as up.

### Tileset

A 3D Tiles tileset.

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**asset**|`object`|Metadata about the entire tileset.|No|
|**properties**|`any`|A dictionary object of metadata about per-feature properties.|No|
|**geometricError**|`number`|The error, in meters, introduced if this tileset is not rendered. At runtime, the geometric error is used to compute screen space error (SSE), i.e., the error measured in pixels.| :white_check_mark: Yes|
|**root**|`object`|A tile in a 3D Tiles tileset.|No|
|**extensionsUsed**|`string` `[1-*]`|Names of 3D Tiles extensions used somewhere in this tileset.|No|
|**extensionsRequired**|`string` `[1-*]`|Names of 3D Tiles extensions required to properly load this tileset.|No|
|**extensions**|`object`|Dictionary object with extension-specific objects.|No|
|**extras**|`any`|Application-specific data.|No|

Additional properties are not allowed.

#### Tileset.asset

Metadata about the entire tileset.

* **Type**: `object`
* **Required**: No

#### Tileset.properties

A dictionary object of metadata about per-feature properties.

* **Type**: `any`
* **Required**: No
* **Type of each property**: `object`

#### Tileset.geometricError :white_check_mark:

The error, in meters, introduced if this tileset is not rendered. At runtime, the geometric error is used to compute screen space error (SSE), i.e., the error measured in pixels.

* **Type**: `number`
* **Required**: Yes
* **Minimum**: ` >= 0`

#### Tileset.root

A tile in a 3D Tiles tileset.

* **Type**: `object`
* **Required**: No

#### Tileset.extensionsUsed

Names of 3D Tiles extensions used somewhere in this tileset.

* **Type**: `string` `[1-*]`
   * Each element in the array must be unique.
* **Required**: No

#### Tileset.extensionsRequired

Names of 3D Tiles extensions required to properly load this tileset.

* **Type**: `string` `[1-*]`
   * Each element in the array must be unique.
* **Required**: No

#### Tileset.extensions

Dictionary object with extension-specific objects.

* **Type**: `object`
* **Required**: No
* **Type of each property**: Extension

#### Tileset.extras

Application-specific data.

* **Type**: `any`
* **Required**: No


---------------------------------------
<a name="reference-asset"></a>
### Asset

Metadata about the entire tileset.

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**version**|`string`|The 3D Tiles version.  The version defines the JSON schema for the tileset JSON and the base set of tile formats.| :white_check_mark: Yes|
|**tilesetVersion**|`string`|Application-specific version of this tileset, e.g., for when an existing tileset is updated.|No|
|**extensions**|`object`|Dictionary object with extension-specific objects.|No|
|**extras**|`any`|Application-specific data.|No|

Additional properties are not allowed.

#### Asset.version :white_check_mark:

The 3D Tiles version.  The version defines the JSON schema for the tileset JSON and the base set of tile formats.

* **Type**: `string`
* **Required**: Yes

#### Asset.tilesetVersion

Application-specific version of this tileset, e.g., for when an existing tileset is updated.

* **Type**: `string`
* **Required**: No

#### Asset.extensions

Dictionary object with extension-specific objects.

* **Type**: `object`
* **Required**: No
* **Type of each property**: Extension

#### Asset.extras

Application-specific data.

* **Type**: `any`
* **Required**: No




---------------------------------------
<a name="reference-bounding-volume"></a>
### Bounding Volume

A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**box**|`number` `[12]`|An array of 12 numbers that define an oriented bounding box.  The first three elements define the x, y, and z values for the center of the box.  The next three elements (with indices 3, 4, and 5) define the x axis direction and half-length.  The next three elements (indices 6, 7, and 8) define the y axis direction and half-length.  The last three elements (indices 9, 10, and 11) define the z axis direction and half-length.|No|
|**region**|`number` `[6]`|An array of six numbers that define a bounding geographic region in EPSG:4979 coordinates with the order [west, south, east, north, minimum height, maximum height]. Longitudes and latitudes are in radians, and heights are in meters above (or below) the WGS84 ellipsoid.|No|
|**sphere**|`number` `[4]`|An array of four numbers that define a bounding sphere.  The first three elements define the x, y, and z values for the center of the sphere.  The last element (with index 3) defines the radius in meters.|No|
|**extensions**|`object`|Dictionary object with extension-specific objects.|No|
|**extras**|`any`|Application-specific data.|No|

Additional properties are not allowed.

#### BoundingVolume.box

An array of 12 numbers that define an oriented bounding box.  The first three elements define the x, y, and z values for the center of the box.  The next three elements (with indices 3, 4, and 5) define the x axis direction and half-length.  The next three elements (indices 6, 7, and 8) define the y axis direction and half-length.  The last three elements (indices 9, 10, and 11) define the z axis direction and half-length.

* **Type**: `number` `[12]`
* **Required**: No

#### BoundingVolume.region

An array of six numbers that define a bounding geographic region in EPSG:4979 coordinates with the order [west, south, east, north, minimum height, maximum height]. Longitudes and latitudes are in radians, and heights are in meters above (or below) the WGS84 ellipsoid.

* **Type**: `number` `[6]`
* **Required**: No

#### BoundingVolume.sphere

An array of four numbers that define a bounding sphere.  The first three elements define the x, y, and z values for the center of the sphere.  The last element (with index 3) defines the radius in meters.

* **Type**: `number` `[4]`
* **Required**: No

#### BoundingVolume.extensions

Dictionary object with extension-specific objects.

* **Type**: `object`
* **Required**: No
* **Type of each property**: Extension

#### BoundingVolume.extras

Application-specific data.

* **Type**: `any`
* **Required**: No




---------------------------------------
<a name="reference-extension"></a>
### Extension

Dictionary object with extension-specific objects.

Additional properties are allowed.

* **Type of each property**: `object`



---------------------------------------
<a name="reference-extras"></a>
### Extras

Application-specific data.

* **JSON schema**: [`extras.schema.json`](../../schema/extras.schema.json)



---------------------------------------
<a name="reference-properties"></a>
### Properties

A dictionary object of metadata about per-feature properties.

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**maximum**|`number`|The maximum value of this property of all the features in the tileset.| :white_check_mark: Yes|
|**minimum**|`number`|The minimum value of this property of all the features in the tileset.| :white_check_mark: Yes|
|**extensions**|`object`|Dictionary object with extension-specific objects.|No|
|**extras**|`any`|Application-specific data.|No|

Additional properties are not allowed.

#### Properties.maximum :white_check_mark:

The maximum value of this property of all the features in the tileset.

* **Type**: `number`
* **Required**: Yes

#### Properties.minimum :white_check_mark:

The minimum value of this property of all the features in the tileset.

* **Type**: `number`
* **Required**: Yes

#### Properties.extensions

Dictionary object with extension-specific objects.

* **Type**: `object`
* **Required**: No
* **Type of each property**: Extension

#### Properties.extras

Application-specific data.

* **Type**: `any`
* **Required**: No




---------------------------------------
<a name="reference-tile"></a>
### Tile

A tile in a 3D Tiles tileset.

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**boundingVolume**|`object`|A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.|No|
|**viewerRequestVolume**|`object`|A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.|No|
|**geometricError**|`number`|The error, in meters, introduced if this tile is rendered and its children are not. At runtime, the geometric error is used to compute screen space error (SSE), i.e., the error measured in pixels.| :white_check_mark: Yes|
|**refine**|`string`|Specifies if additive or replacement refinement is used when traversing the tileset for rendering.  This property is required for the root tile of a tileset; it is optional for all other tiles.  The default is to inherit from the parent tile.|No|
|**transform**|`number` `[16]`|A floating-point 4x4 affine transformation matrix, stored in column-major order, that transforms the tile's content--i.e., its features as well as content.boundingVolume, boundingVolume, and viewerRequestVolume--from the tile's local coordinate system to the parent tile's coordinate system, or, in the case of a root tile, from the tile's local coordinate system to the tileset's coordinate system.  transform does not apply to geometricError, nor does it apply any volume property when the volume is a region, defined in EPSG:4979 coordinates.|No, default: `[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]`|
|**content**|`object`|Metadata about the tile's content and a link to the content.|No|
|**children**|`array[]`|An array of objects that define child tiles. Each child tile content is fully enclosed by its parent tile's bounding volume and, generally, has a geometricError less than its parent tile's geometricError. For leaf tiles, the length of this array is zero, and children may not be defined.|No|
|**extensions**|`object`|Dictionary object with extension-specific objects.|No|
|**extras**|`any`|Application-specific data.|No|

Additional properties are not allowed.

#### Tile.boundingVolume

A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.

* **Type**: `object`
* **Required**: No

#### Tile.viewerRequestVolume

A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.

* **Type**: `object`
* **Required**: No

#### Tile.geometricError :white_check_mark:

The error, in meters, introduced if this tile is rendered and its children are not. At runtime, the geometric error is used to compute screen space error (SSE), i.e., the error measured in pixels.

* **Type**: `number`
* **Required**: Yes
* **Minimum**: ` >= 0`

#### Tile.refine

Specifies if additive or replacement refinement is used when traversing the tileset for rendering.  This property is required for the root tile of a tileset; it is optional for all other tiles.  The default is to inherit from the parent tile.

* **Type**: `string`
* **Required**: No
* **Allowed values**:
   * `"ADD"`
   * `"REPLACE"`

#### Tile.transform

A floating-point 4x4 affine transformation matrix, stored in column-major order, that transforms the tile's content--i.e., its features as well as content.boundingVolume, boundingVolume, and viewerRequestVolume--from the tile's local coordinate system to the parent tile's coordinate system, or, in the case of a root tile, from the tile's local coordinate system to the tileset's coordinate system.  transform does not apply to geometricError, nor does it apply any volume property when the volume is a region, defined in EPSG:4979 coordinates.

* **Type**: `number` `[16]`
* **Required**: No, default: `[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]`

#### Tile.content

Metadata about the tile's content and a link to the content.

* **Type**: `object`
* **Required**: No

#### Tile.children

An array of objects that define child tiles. Each child tile content is fully enclosed by its parent tile's bounding volume and, generally, has a geometricError less than its parent tile's geometricError. For leaf tiles, the length of this array is zero, and children may not be defined.

* **Type**: `array[]`
   * Each element in the array must be unique.
* **Required**: No

#### Tile.extensions

Dictionary object with extension-specific objects.

* **Type**: `object`
* **Required**: No
* **Type of each property**: Extension

#### Tile.extras

Application-specific data.

* **Type**: `any`
* **Required**: No




---------------------------------------
<a name="reference-tile-content"></a>
### Tile Content

Metadata about the tile's content and a link to the content.

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**boundingVolume**|`object`|A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.|No|
|**uri**|`string`|A uri that points to the tile's content. When the uri is relative, it is relative to the referring tileset JSON file.| :white_check_mark: Yes|
|**extensions**|`object`|Dictionary object with extension-specific objects.|No|
|**extras**|`any`|Application-specific data.|No|

Additional properties are not allowed.

#### TileContent.boundingVolume

A bounding volume that encloses a tile or its content.  Exactly one `box`, `region`, or `sphere` property is required.

* **Type**: `object`
* **Required**: No

#### TileContent.uri :white_check_mark:

A uri that points to the tile's content. When the uri is relative, it is relative to the referring tileset JSON file.

* **Type**: `string`
* **Required**: Yes

#### TileContent.extensions

Dictionary object with extension-specific objects.

* **Type**: `object`
* **Required**: No
* **Type of each property**: Extension

#### TileContent.extras

Application-specific data.

* **Type**: `any`
* **Required**: No

---------------------------------------
### Data Structures

* **Quadtrees** use when each tile has four uniformly subdivided children.

* **K-d trees** use when children separated by a splitting plane parallel to the x, y, or z axis (or latitude, longitude, height) it can be  2 or n children

* **Octrees** use when each tile have eight children (计划用R-Tree代替 R-Tree可以用于表示多枝情况)
