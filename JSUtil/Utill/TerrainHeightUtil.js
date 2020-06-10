/**
 * @Author DY
 */
import {dependencies} from "../Constants.js";
import {tifimgGetter} from "../../despCore/Entry/EntryManager.js";

import Ellipsoid from "../Math/Ellipsoid.js";
import Coordinate from "../Math/Coordinate.js";
import Point from "../Math/Geometry/2D/Point.js";
import Rectangle from "../Entity/Rectangle.js";

import PromiseChain from "./PromiseChain.js";

/**
 * @class TerrainHeight
 * @classdesc 获取高程工具类
 */
export default class TerrainHeight {
    /**
     * 获取一段线按照某个间隔产生的所有点的高程
     * @param {Object} obj - {position,terrainProvider,granularity}
     * @param {Function} onSuccess - 成功回调
     * @param {Function} onFail - 失败回调
     * @param onPending
     * @example
     * let a;
     * TerrainHeight.updateHeight({
     * position: Coordinate.handlePosition([94.0, 24.0, 94.0, 23.0]),
     * terrainProvider: this.viewer.terrainProvider
     * }, function (as) {
     * a = as;
     * });
     */
    static updateHeight(obj, onSuccess, onFail, onPending = () => {
    }) {
        let subposition = dependencies.Cesium.PolylinePipeline.generateArc({
            positions: obj.position,
            granularity: obj.granularity === undefined ? 0.00001 : obj.granularity
        });
        let ellipos = Ellipsoid.getGlobe();
        let modifiedPosition = [];
        for (let i = 0; i < subposition.length; i += 3) {
            modifiedPosition.push(ellipos.cartesianToCartographic(new dependencies.Cesium.Cartesian3(subposition[i], subposition[i + 1], subposition[i + 2])));
        }

        if (tifimgGetter.isActive()) {
            let promises = [];
            let tmp = [];
            let size = 0;
            for (let i = 0; i < modifiedPosition.length; i++) {
                tmp.push(modifiedPosition[i]);
                size++;
                if (size === 20) {
                    size = 0;
                    let tmpp = tmp;
                    promises.push((resolve, reject) => {
                        let points = "";
                        for (let i = 0; i < tmpp.length; i++) {
                            let target = tmpp[i];
                            points = points + `${target.longitude},${target.latitude}丨`;
                        }
                        points = points.substring(0, points.length - 1);
                        tifimgGetter.loadTifData("default", undefined, undefined, points).then((success) => {
                            let returnData = JSON.parse(success);
                            for (let i = 0; i < tmpp.length; i++) {
                                let target = tmpp[i];
                                target.height = returnData[i].data[0];
                            }
                            let r = onPending(tmpp);
                            if (r === false) {
                                reject("Stop By User");
                            }
                            resolve(modifiedPosition);
                        }, (error) => {
                            reject(error);
                        });
                    });
                    tmp = [];
                }
            }
            if (tmp.length > 0) {
                promises.push((resolve, reject) => {
                    let points = "";
                    for (let i = 0; i < tmp.length; i++) {
                        let target = tmp[i];
                        points = points + `${target.longitude},${target.latitude}丨`;
                    }
                    points = points.substring(0, points.length - 1);
                    tifimgGetter.loadTifData("default", undefined, undefined, points).then((success) => {
                        let returnData = JSON.parse(success);
                        for (let i = 0; i < tmp.length; i++) {
                            let target = tmp[i];
                            target.height = returnData[i].data[0];
                        }
                        let r = onPending(tmp);
                        if (r === false) {
                            reject("Stop By User");
                        }
                        resolve(modifiedPosition);
                    }, (error) => {
                        reject(error);
                    });
                });
            }
            let promiseChain = new PromiseChain(promises, onSuccess, onFail);
            promiseChain.all();
        } else {
            if (obj.terrainProvider instanceof dependencies.Cesium.EllipsoidTerrainProvider) {
                onSuccess(modifiedPosition);
            } else {
                let promises = [];
                let tmp = [];
                let size = 0;
                for (let i = 0; i < modifiedPosition.length; i++) {
                    tmp.push(modifiedPosition[i]);
                    size++;
                    if (size === 300) {
                        size = 0;
                        let tmpp = tmp;
                        promises.push((resolve, reject) => {
                            dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(obj.terrainProvider, tmpp), (as) => {
                                let r = onPending(as);
                                if (r === false) {
                                    reject("Stop By User");
                                }
                                resolve(modifiedPosition);
                            }, (msg) => {
                                reject(msg);
                            });
                        });
                        tmp = [];
                    }
                }
                if (tmp.length > 0) {
                    promises.push((resolve, reject) => {
                        dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(obj.terrainProvider, tmp), (as) => {
                            let r = onPending(as);
                            if (r === false) {
                                reject("Stop By User");
                            }
                            resolve(modifiedPosition);
                        }, (msg) => {
                            reject(msg);
                        });
                    });
                }
                let promiseChain = new PromiseChain(promises, onSuccess, onFail);
                promiseChain.all();
            }
        }
    }

    /**
     * 更新单个点的高程信息
     * @param {Array} position - [lon,lat,alt]
     * @param {Object} terrainProvider - 地形服务提供方
     * @return {Promise}
     */
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
                dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(terrainProvider, ret), (as) => {
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

    /**
     * 生成一个相对于单点的矩阵
     * @param {Object} obj
     * @return {Promise}
     */
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

    /**
     * 获取单点的矩阵的高度
     * @param matrix
     * @param terrainProvider
     * @return {Promise}
     */
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

    /**
     * 获取大矩阵的高程
     * @param obj
     * @param onSuccess
     * @param onFail
     * @param onPending
     */
    static getRectangleMatrix(obj, onSuccess, onFail, onPending) {
        let granularity = (obj.granularity !== undefined && obj.granularity !== null) ? obj.granularity : 0.00001;
        let rec = [...obj.Polygon.rectangle];
        let matrix = TerrainHeight.generateMatix(obj.Polygon.rectangle, granularity);
        matrix = TerrainHeight.excludeBound(matrix, obj.Polygon);
        if (tifimgGetter.isActive()) {
            let promises = [];
            let firstL = matrix.length;
            let secondL = matrix[0].length;
            if (firstL * secondL < 30000) {
                let geojson = Rectangle.toGeoJson2D(rec);
                promises.push((resolve, reject) => {
                    tifimgGetter.loadTifData(undefined, JSON.stringify(geojson), granularity, undefined).then((success) => {
                        let returnData = JSON.parse(success);
                        let numberBands = returnData.numberBands;
                        let data = returnData.data;
                        for (let i = 0; i < data.length; i += numberBands) {
                            let index = i / numberBands;
                            let first = Math.floor(index / secondL);
                            let second = index - first * secondL;
                            let target = matrix[first][second];
                            if (target && target !== 0) {
                                target.height = data[i];
                            }
                        }
                        let r = onPending(returnData);
                        if (r === false) {
                            reject("Stop By User");
                        }
                        resolve(matrix);
                    }, (error) => {
                        reject(error);
                    });
                });
            } else {
                let minLat = rec[1];
                let maxLat = rec[3];
                let totalIndex = Math.ceil((maxLat - minLat) / granularity);
                for (let i = 0; i < totalIndex; i++) {
                    let targetLat = minLat + granularity * i;
                    let tmpRec = [rec[0], targetLat, rec[2], targetLat];
                    let geojson = Rectangle.toGeoJson2D(tmpRec);
                    let index = i;
                    promises.push((resolve, reject) => {
                        tifimgGetter.loadTifData(undefined, JSON.stringify(geojson), granularity, undefined).then((success) => {
                            let returnData = JSON.parse(success);
                            let numberBands = returnData.numberBands;
                            let data = returnData.data;
                            for (let i = 0; i < data.length; i += numberBands) {
                                let target = matrix[i / numberBands][index];
                                if (target && target !== 0) {
                                    target.height = data[i];
                                }
                            }
                            let r = onPending(returnData);
                            if (r === false) {
                                reject("Stop By User");
                            }
                            resolve(matrix);
                        }, (error) => {
                            reject(error);
                        });
                    });
                }
            }
            let promiseChain = new PromiseChain(promises, onSuccess, onFail);
            promiseChain.all();
        } else {
            if (obj.terrainProvider instanceof dependencies.Cesium.EllipsoidTerrainProvider) {
                onSuccess(matrix);
            } else {
                let promises = [];
                let size = 0;
                let tmp = [];
                for (let i = 0; i < matrix.length; i++) {
                    for (let j = 0; j < matrix[i].length; j++) {
                        if (matrix[i][j] !== 0) {
                            tmp.push(matrix[i][j]);
                            size++;
                            if (size === 300) {
                                size = 0;
                                let tmpp = tmp;
                                promises.push((resolve, reject) => {
                                    dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(obj.terrainProvider, tmpp), (as) => {
                                        let r = onPending(as);
                                        if (r === false) {
                                            reject("Stop By User");
                                        }
                                        resolve(matrix);
                                    }, (msg) => {
                                        reject(msg);
                                    });
                                });
                                tmp = [];
                            }
                        }
                    }
                    if (tmp.length > 0) {
                        promises.push((resolve, reject) => {
                            dependencies.Cesium.when(dependencies.Cesium.sampleTerrainMostDetailed(obj.terrainProvider, tmp), (as) => {
                                let r = onPending(as);
                                if (r === false) {
                                    reject("Stop By User");
                                }
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
    }

    static getRectangleData(rectangle, granularity, useDegree = false) {
        if (tifimgGetter.isActive()) {
            return tifimgGetter.loadTifData(undefined, JSON.stringify(Rectangle.toGeoJson2D(rectangle)), granularity, undefined, undefined,useDegree);
        } else {
            return undefined;
        }
    }

    /**
     * 删除不在范围内的点
     * @param matrix
     * @param Polygon
     * @return {*}
     */
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

    /**
     * 生成矩形矩阵
     * @param rectangle
     * @param granularity
     * @return {Array}
     */
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

    /**
     * 生成颜色对应矩阵
     * @param widthO
     * @param heightO
     * @param matrix
     * @return {{data: Array, height: Array}}
     */
    static imageColorArray(widthO, heightO, matrix) {
        let heightArray = [], imgDataArray = [];
        let max = -Infinity, min = Infinity;
        for (let i = 0; i < widthO * heightO; i++) {
            let width = i % widthO, height = heightO - Math.floor(i / widthO);
            if (matrix[width][height - 1] !== 0) {
                imgDataArray.push(matrix[width][height - 1].DESPEWA);
                heightArray.push([width, height, matrix[width][height - 1].height]);
                max = Math.max(max, matrix[width][height - 1].height);
                min = Math.min(min, matrix[width][height - 1].height);
            } else {
                imgDataArray.push(0);
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
}
