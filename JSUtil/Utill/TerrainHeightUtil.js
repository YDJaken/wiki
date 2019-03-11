/**
 * @Author DY
 */
import {dependencies, dom_need, Global_viewer} from "../Constants.js";
import Ellipsoid from "../Math/Ellipsoid.js";

let echarts = dependencies.echarts, echartsID = dom_need.echarts;

import Coordinate from "../Math/Coordinate.js";
import Point from "../Math/Geometry/2D/Point.js";
import PromiseChain from "./PromiseChain.js";
import ColorUtil from "./ColorUtil.js";

export const TerrainHeight_echart = {charts: null};

export default class TerrainHeight {
    /**
     *
     * @param obj {position,terrainProvider,granularity}
     * @param onSuccess
     * @param onFail
     * 示例：
     * let a;
     TerrainHeight.updateHeight({
        position: Coordinate.handlePosition([94.0, 24.0, 94.0, 23.0]),
        terrainProvider: this.viewer.terrainProvider
      }, function (as) {
        a = as;
      });
     */
    static updateHeight(obj, onSuccess, onFail) {
        let subposition = dependencies.Cesium.PolylinePipeline.generateArc({
            positions: obj.position,
            granularity: obj.granularity === undefined ? 0.00001 : obj.granularity
        });
        let ellipos = Ellipsoid.getGlobe();
        let modifiedPosition = [];
        for (let i = 0; i < subposition.length; i += 3) {
            modifiedPosition.push(ellipos.cartesianToCartographic(new dependencies.Cesium.Cartesian3(subposition[i], subposition[i + 1], subposition[i + 2])));
        }
        if (obj.terrainProvider instanceof dependencies.Cesium.EllipsoidTerrainProvider) {
            onSuccess(modifiedPosition);
        } else {
            dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(obj.terrainProvider, modifiedPosition), onSuccess, onFail);
        }
    }

    static updatePosition(position, terrainProvider) {
        return new Promise(function (resolve, reject) {
            if (terrainProvider instanceof dependencies.Cesium.EllipsoidTerrainProvider) {
                resolve(position);
            } else {
                let ret = [];
                for (let i = 0; position.length - i >= 3; i += 3) {
                    ret.push({
                        longitude: Coordinate.angleToRadian(position[i]),
                        latitude: Coordinate.angleToRadian(position[i + 1]),
                        height: position[i + 2]
                    });
                }
                dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(Global_viewer.viewer.terrainProvider, ret), (as) => {
                    let index = 0;
                    for (let i = 0; position.length - i >= 3; i += 3) {
                        position[i + 2] = as[index++].height;
                    }
                    resolve(position);
                }, (msg) => {
                    reject(msg);
                });
            }
        });
    }

    static getMatrix(obj) {
        return new Promise(function (resolve, reject) {
            let matrix = [];
            let pointPosition = obj.positions;
            let granularity = obj.granularity === undefined ? 0.00001 : obj.granularity;
            for (let i = 0; i < 3; i++) {
                switch (i) {
                    case 0:
                        matrix[i] = [{
                            longitude: Coordinate.angleToRadian(pointPosition[0] - granularity),
                            latitude: Coordinate.angleToRadian(pointPosition[1] - granularity),
                            height: 0
                        }, {
                            longitude: Coordinate.angleToRadian(pointPosition[0]),
                            latitude: Coordinate.angleToRadian(pointPosition[1] - granularity),
                            height: 0
                        }, {
                            longitude: Coordinate.angleToRadian(pointPosition[0] + granularity),
                            latitude: Coordinate.angleToRadian(pointPosition[1] - granularity),
                            height: 0
                        }];
                        break;
                    case 1:
                        matrix[i] = [{
                            longitude: Coordinate.angleToRadian(pointPosition[0] - granularity),
                            latitude: Coordinate.angleToRadian(pointPosition[1]),
                            height: 0
                        }, {
                            longitude: Coordinate.angleToRadian(pointPosition[0]),
                            latitude: Coordinate.angleToRadian(pointPosition[1]),
                            height: 0
                        }, {
                            longitude: Coordinate.angleToRadian(pointPosition[0] + granularity),
                            latitude: Coordinate.angleToRadian(pointPosition[1]),
                            height: 0
                        }];
                        break;
                    case 2:
                        matrix[i] = [{
                            longitude: Coordinate.angleToRadian(pointPosition[0] - granularity),
                            latitude: Coordinate.angleToRadian(pointPosition[1] + granularity),
                            height: 0
                        }, {
                            longitude: Coordinate.angleToRadian(pointPosition[0]),
                            latitude: Coordinate.angleToRadian(pointPosition[1] + granularity),
                            height: 0
                        }, {
                            longitude: Coordinate.angleToRadian(pointPosition[0] + granularity),
                            latitude: Coordinate.angleToRadian(pointPosition[1] + granularity),
                            height: 0
                        }];
                        break;
                }
            }
            TerrainHeight.getHeight(matrix, obj.terrainProvider).then((data) => {
                resolve(data);
            }, (msg) => {
                reject(msg);
            });
        });
    }

    static getHeight(matrix, terrainProvider) {
        let index = 0;
        if (terrainProvider instanceof dependencies.Cesium.EllipsoidTerrainProvider) {
            return new Promise(function (resolve, reject) {
                resolve(matrix);
            });
        } else {
            return new Promise(function (resolve, reject) {
                for (let i = 0; i < 3; i++) {
                    let j = i;
                    dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(terrainProvider, matrix[j]), (as) => {
                        matrix[j] = as;
                        if (++index === 3) {
                            resolve(matrix);
                        }
                    }, () => {
                        reject();
                    });
                }
            });
        }
    }

    static getRectangleMatrix(obj, onSuccess, onFail) {
        let granularity = (obj.granularity !== undefined && obj.granularity !== null) ? obj.granularity : 0.00001;
        let matrix = TerrainHeight.generateMatix(obj.Polygon.rectangle, granularity);
        matrix = TerrainHeight.excludeBound(matrix, obj.Polygon);
        if (obj.terrainProvider instanceof dependencies.Cesium.EllipsoidTerrainProvider) {
            onSuccess(matrix);
        } else {
            let promises = [];
            for (let i = 0; i < matrix.length; i++) {
                let tmp = [];
                for (let j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] !== 0) tmp.push(matrix[i][j]);
                }
                if (tmp.length > 0) {
                    promises.push((resolve, reject) => {
                        dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(obj.terrainProvider, tmp), (as) => {
                            resolve(matrix);
                        }, (msg) => {
                            reject(msg);
                        });
                    });
                }
            }
            let promiseChain = new PromiseChain(promises, onSuccess, onFail);
            promiseChain.all();
        }
    }

    static excludeBound(matrix, Polygon) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (!Polygon.contains(matrix[i][j])) matrix[i][j] = 0;
            }
        }
        /*// debug 时开启,可以查看是否正确框出图形
        let String = '';
        for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
              String += '.';
            } else {
              String += '*';
            }
          }
          String += '\n';
        }
        console.log(String);*/

        return matrix;
    }

    static generateMatix(rectangle, granularity) {
        let startLon = rectangle.shift();
        let startLat = rectangle.shift();
        let endLon = rectangle.shift();
        let endLat = rectangle.shift();
        let lonArray = [];
        let latArray = [];
        if (startLon > endLon) {
            while (startLon > endLon) {
                lonArray.push(startLon);
                startLon -= granularity;
            }
        } else {
            while (startLon < endLon) {
                lonArray.push(startLon);
                startLon += granularity;
            }
        }
        if (startLat > endLat) {
            while (startLat > endLat) {
                latArray.push(startLat);
                startLat -= granularity;
            }
        } else {
            while (startLat < endLat) {
                latArray.push(startLat);
                startLat += granularity;
            }
        }
        let ret = [];
        for (let i = 0; i < lonArray.length; i++) {
            let tmp = [];
            for (let j = 0; j < latArray.length; j++) {
                tmp.push(new Point(lonArray[i], latArray[j], 0));
            }
            ret.push(tmp);
        }
        return ret;
    }

    static removeChart(dom = document.getElementById(echartsID)) {
        if (TerrainHeight_echart.charts !== null) TerrainHeight_echart.charts.dispose(dom);
        TerrainHeight_echart.charts = null;
        dom.style.display = "none";
        if (document.getElementById(`${echartsID}_button`) !== null) {
            document.getElementById(`${echartsID}_button`).parent.removeChild(document.getElementById(`${echartsID}_button`));
        }
    }

    static imageColorArray(imgData, matrix, digColor, fillColor) {
        let imgDataArray = imgData.data;
        let heightArray = [];
        let max = -Infinity, min = Infinity;
        for (let i = 0; i < imgDataArray.length / 4; i++) {
            let width = i % imgData.width, height = imgData.height - Math.floor(i / imgData.width);
            if (matrix[width][height - 1] !== 0) {
                if (matrix[width][height - 1].DESPEWA === 1) {
                    imgDataArray[i * 4] = digColor.r;
                    imgDataArray[i * 4 + 1] = digColor.g;
                    imgDataArray[i * 4 + 2] = digColor.b;
                    imgDataArray[i * 4 + 3] = 255;
                } else if (matrix[width][height - 1].DESPEWA === 2) {
                    imgDataArray[i * 4] = fillColor.r;
                    imgDataArray[i * 4 + 1] = fillColor.g;
                    imgDataArray[i * 4 + 2] = fillColor.b;
                    imgDataArray[i * 4 + 3] = 255;
                }
                heightArray.push([width, height, matrix[width][height - 1].height]);
                max = Math.max(max, matrix[width][height - 1].height);
                min = Math.min(min, matrix[width][height - 1].height);
            } else {
                heightArray.push([width, height, 0]);
            }
        }

        for (let i = 0; i < heightArray.length; i++) {
            if (heightArray[i][2] === 0) heightArray[i][2] = min;
        }

        heightArray.push(Math.floor(max + 10), Math.floor(min - 10));

        return {
            data: imgDataArray,
            height: heightArray
        }
    }

    static loadEarthWork(matrix, propertiesNumber, digColor, fillColor) {
        let img = new Image();
        img.height = matrix[0].length;
        img.width = matrix.length;
        let canvas = document.createElement('canvas');
        canvas.height = img.height;
        canvas.width = img.width;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let imgDataArray = TerrainHeight.imageColorArray(ctx.getImageData(0, 0, img.width, img.height), matrix, ColorUtil.hex2Rgba(digColor), ColorUtil.hex2Rgba(fillColor));
        let dom = document.getElementById(echartsID);
        dom.style.display = "block";
        if (TerrainHeight_echart.charts === null) TerrainHeight_echart.charts = echarts.init(dom, 'light', {renderer: 'canvas'});
        let min = imgDataArray.height.pop();
        let max = imgDataArray.height.pop();
        TerrainHeight_echart.charts.setOption({
            title: {
                text:
                    `挖填方分析
        
        挖掘土方量: ${propertiesNumber.digAmount} 立方米
        
        挖掘面积: ${propertiesNumber.digArea} 平方米
        
        填埋土方量: ${propertiesNumber.fillAmount} 立方米
        
        填埋面积: ${propertiesNumber.fillArea} 平方米`
            }
            , tooltip: {},
            backgroundColor: '#fff',
            xAxis3D: {
                type: 'value'
            },
            yAxis3D: {
                type: 'value'
            },
            zAxis3D: {
                type: 'value',
                min: min,
                max: max
            },
            grid3D: {
                axisPointer: {
                    show: false
                },
                viewControl: {
                    distance: 100
                },
                postEffect: {
                    enable: true
                },
                light: {
                    main: {
                        shadow: true,
                        intensity: 2
                    },
                    ambientCubemap: {
                        texture: 'static/echart/canyon.hdr',
                        exposure: 2,
                        diffuseIntensity: 0.2,
                        specularIntensity: 1
                    }
                }
            },
            series: [{
                type: 'surface',
                silent: true,
                wireframe: {
                    show: false
                },
                itemStyle: {
                    color: function (params) {
                        let i = params.dataIndex;
                        let r = imgDataArray.data[i * 4];
                        let g = imgDataArray.data[i * 4 + 1];
                        let b = imgDataArray.data[i * 4 + 2];
                        return 'rgb(' + [r, g, b].join(',') + ')';
                    }, opacity: 0.8
                },
                data: imgDataArray.height
            }]
        });
        if (document.getElementById(`${echartsID}_button`) === null) {
            document.getElementById(echartsID).firstChild.appendChild(TerrainHeight.creathButton());
        }
    }

    static loadCrossSection(position) {
        let heightArray = [];
        let xAx = [];
        for (let i = 0; i < position.length; i++) {
            heightArray.push(position[i].height);
            xAx.push(`经度:${Coordinate.radianToAngle(position[i].longitude)},纬度:${Coordinate.radianToAngle(position[i].latitude)},海拔`);
        }
        let dom = document.getElementById(echartsID);
        dom.style.display = "block";
        if (TerrainHeight_echart.charts === null) TerrainHeight_echart.charts = echarts.init(dom, 'dark');
        TerrainHeight_echart.charts.setOption({
            title: {
                text: '剖面分析'
            },
            tooltip: {},
            legend: {
                data: ['剖面分析']
            }, /*toolbox: {
                            left: 'center',
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                restore: {},
                                saveAsImage: {}
                            }
                        },*/
            dataZoom: [{
                startValue: 0
            }, {
                type: 'inside'
            }],
            xAxis: {show: false, data: xAx},
            yAxis: {},
            series: [{
                name: '剖面分析',
                type: 'line',
                data: heightArray,
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'red' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'blue' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            }]
        });
        if (document.getElementById(`${echartsID}_button`) === null) {
            document.getElementById(echartsID).firstChild.appendChild(TerrainHeight.creathButton());
        }
    }

    static creathButton() {
        let a = document.createElement('button');
        a.style = "z-index: 99999; position: absolute; left:95%; overflow: dispaly; border-width: 0px;" +
            "    padding: 4px 4px 0 0;\n" +
            "    text-align: center;\n" +
            "    width: 36px;\n" +
            "    height: 28px;\n" +
            "    font: 16px/14px Tahoma, Verdana, sans-serif;\n" +
            "    color: #ffffff;\n" +
            "    text-decoration: none;\n" +
            "    font-weight: bold;\n" +
            "    background: transparent;";
        a.id = `${echartsID}_button`;
        a.innerText = 'x';
        a.onclick = function () {
            TerrainHeight.removeChart();
        };
        return a;
    }
}