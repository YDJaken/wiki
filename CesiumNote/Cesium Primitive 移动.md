``` javascript
static loadModelMatrix2(position, oldposition) {
    let ca = Coordinate.handlePositon(position);
    let caO = Coordinate.handlePositon(oldposition);
    let ini = [];
    ini = Cesium.Matrix4.pack(Tapered.Mat(), ini);
    ini[12] = ca.x - caO.x;
    ini[13] = ca.y - caO.y;
    ini[14] = ca.z - caO.z;
    ini = Cesium.Matrix4.unpack(ini);
    return ini;
  }
```