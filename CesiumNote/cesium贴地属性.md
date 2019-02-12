classificationType:
Cesium.ClassificationType.BOTH //贴地于地形和3D瓦片
Cesium.ClassificationType.TERRAIN;//只作用于地形
Cesium.ClassificationType.CESIUM_3D_TILE;//只作用于3D瓦片


height:100%;width:100%


1 0 0 dx
0 1 0 dy
0 0 1 dz
0 0 0 1


0  1  2  3     0  4  8  12
4  5  6  7     1  5  9  13
8  9  10 11    2  6  10 14
12 13 14 15    3  7  11 15