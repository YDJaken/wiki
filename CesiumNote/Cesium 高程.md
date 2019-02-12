Cesium.PolylinePipeline.generateArc 获得两个点之间的所有点的世界坐标。

将其用Ellipsoid.prototype.cartesianToCartographic转化为带高程的经纬度只是其高程为0

之后使用var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
Cesium.when(promise, function(updatedPositions) {}
获取其高程信息