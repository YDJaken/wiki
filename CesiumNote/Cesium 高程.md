Cesium.PolylinePipeline.generateArc 获得两个点之间的所有点的世界坐标。

将其用Ellipsoid.prototype.cartesianToCartographic转化为带高程的经纬度只是其高程为0

之后使用var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
Cesium.when(promise, function(updatedPositions) {}
获取其高程信息


```
// 修改地下地形
viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
let tileProvider = viewer.scene.globe._surface._tileProvider;
tileProvider._renderState = despCore.RenderState.fromCache({
    'cull': {
        'enabled': false
    },
    'depthTest': {
        'enabled': true,
        'func': 513
    },
    'blending': {
        "enabled": true,
        "equationRgb": 32774,
        "equationAlpha": 32774,
        "functionSourceRgb": 770,
        "functionSourceAlpha": 770,
        "functionDestinationRgb": 771,
        "functionDestinationAlpha": 771
    }
});

tileProvider._blendRenderState = despCore.RenderState.fromCache({
        'cull': {
            'enabled': false
        },
        'depthTest': {
            'enabled': true,
            'func': 515
        },
        'blending': {
            "enabled": true,
            "equationRgb": 32774,
            "equationAlpha": 32774,
            "functionSourceRgb": 770,
            "functionSourceAlpha": 770,
            "functionDestinationRgb": 771,
            "functionDestinationAlpha": 771
        }
    }
);
let backup = despCore.Occluder.prototype.isBoundingSphereVisible;

despCore.Occluder.prototype.isBoundingSphereVisible = function (point) {
    if (this._horizonDistance === Number.MAX_VALUE) {
        return true;
    }
    return backup.bind(this)(point)
};
// Globe.prototype.pickWorldCoordinates = 某个Cesium函数
despCore.DepthPlane.prototype.execute = function () {
};
```


