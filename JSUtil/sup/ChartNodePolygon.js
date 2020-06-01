/**
 * @Author DY
 */
import RiverPolygon from "../../despUtil/Hydrology/RiverPolygon";
import Check from "../../despUtil/Util/Check";
import RiverMap from "../../despUtil/Hydrology/RiverMap";
import BorderSearchUtil from "../../despUtil/Hydrology/BorderSearchUtil";
import Polygon2D from "../../despUtil/Math/Geometry/2D/Polygon";
import Point2D from "../../despUtil/Math/Geometry/2D/Point";
import Circle2D from "../../despUtil/Math/Geometry/2D/Circle";

export default class ChartNodePolygon extends RiverPolygon {
    constructor(obj) {
        super(obj);
        this.index = obj.index;
    }

    _isInside(chartNodeMap, node) {
        let xy = node.getAttr("xy");
        let g00 = chartNodeMap.XYtoIndex(xy.x - 1, xy.y - 1);
        if (RiverMap._checkValid(g00)) {
            g00 = chartNodeMap.nodeData[g00];
            let tmpPolygon = g00.getAttr("polygon");
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g01 = chartNodeMap.XYtoIndex(xy.x, xy.y - 1);
        if (RiverMap._checkValid(g01)) {
            g01 = chartNodeMap.nodeData[g01];
            let tmpPolygon = g01.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g02 = chartNodeMap.XYtoIndex(xy.x + 1, xy.y - 1);
        if (RiverMap._checkValid(g02)) {
            g02 = chartNodeMap.nodeData[g02];
            let tmpPolygon = g02.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g10 = chartNodeMap.XYtoIndex(xy.x - 1, xy.y);
        if (RiverMap._checkValid(g10)) {
            g10 = chartNodeMap.nodeData[g10];
            let tmpPolygon = g10.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g12 = chartNodeMap.XYtoIndex(xy.x + 1, xy.y);
        if (RiverMap._checkValid(g12)) {
            g12 = chartNodeMap.nodeData[g12];
            let tmpPolygon = g12.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g20 = chartNodeMap.XYtoIndex(xy.x - 1, xy.y + 1);
        if (RiverMap._checkValid(g20)) {
            g20 = chartNodeMap.nodeData[g20];
            let tmpPolygon = g20.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g21 = chartNodeMap.XYtoIndex(xy.x, xy.y + 1);
        if (RiverMap._checkValid(g21)) {
            g21 = chartNodeMap.nodeData[g21];
            let tmpPolygon = g21.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }
        let g22 = chartNodeMap.XYtoIndex(xy.x + 1, xy.y + 1);
        if (RiverMap._checkValid(g22)) {
            g22 = chartNodeMap.nodeData[g22];
            let tmpPolygon = g22.getAttr("polygon")
            if (!Check.checkDefined(tmpPolygon) || tmpPolygon !== this) {
                return false;
            }
        }

        return xy.x !== chartNodeMap.width - 1 && xy.x !== 0 && xy.y !== chartNodeMap.height - 1 && xy.y !== 0;

    }

    static _compareFunction(nodeOne, nodeTwo, chartNodeMap, polygon) {
        if (Check.checkDefined(nodeTwo)) {
            let oneIndex = chartNodeMap._getIndex(nodeOne.getAttr("value"));
            let twoIndex = chartNodeMap._getIndex(nodeTwo.getAttr("value"));
            return oneIndex === twoIndex && !polygon._isInside(chartNodeMap, nodeOne);
        }
        return false;
    }

    loadBoundary(chartNodeMap) {
        let outerPolygon = [];
        let innerPolygons = [];

        let polygons = [];
        for (let i = 0; i < this.nodeData.length; i++) {
            let target = this.nodeData[i];

            if (!this._isInside(chartNodeMap, target)) {
                if (!Check.checkDefined(target.getAttr("marker"))) {
                    target.setAttr("marker", chartNodeMap._getIndex(target.getAttr("value")));
                } else {
                    continue;
                }
                let loopCount = 0;
                let subNodes = [{node: target, direction: 0}];
                let index = this.index;
                let markFun = function marker(node) {
                    if (Check.checkDefined(node)) {
                        let nodeIndex = chartNodeMap._getIndex(node.getAttr("value"));
                        if (nodeIndex === index) {
                            node.setAttr("marker", nodeIndex);
                        }
                    }
                }
                let nextResult = BorderSearchUtil.searchNextNode(chartNodeMap, target, 4, this, ChartNodePolygon._compareFunction, markFun);
                L1:  while (Check.checkDefined(nextResult)) {
                    nextResult.nextNode.setAttr("marker", target.getAttr("marker"));
                    subNodes.push({node: nextResult.nextNode, direction: nextResult.nextDirection});
                    let seedNode = nextResult.nextNode;
                    nextResult = BorderSearchUtil.searchNextNode(chartNodeMap, nextResult.nextNode, nextResult.nextDirection, this, ChartNodePolygon._compareFunction, markFun);
                    if (Check.checkDefined(nextResult)) {
                        if (nextResult.nextNode === target) {
                            subNodes.push({node: nextResult.nextNode, direction: nextResult.nextDirection});
                            break;
                        }
                        // 检查回头问题
                        let length = subNodes.length >= 100 ? 100 : subNodes.length;
                        for (let j = 0; j < length; j++) {
                            let tmpTarget = subNodes[subNodes.length - 1 - j];
                            if (tmpTarget.node === nextResult.nextNode && tmpTarget.direction === nextResult.nextDirection) {
                                break L1;
                            }
                        }
                        let test = BorderSearchUtil.testNode(chartNodeMap, seedNode, nextResult.nextDirection, this, ChartNodePolygon._compareFunction, markFun);
                        if (Check.checkDefined(test)) {
                            nextResult.nextNode = test.node;
                            nextResult.nextDirection = test.direction;
                        }
                    }
                    loopCount++;
                    if (loopCount > 50000) {
                        subNodes = undefined;
                        break;
                    }
                }
                if (subNodes && subNodes.length > 2) {
                    polygons.push(subNodes);
                }
            }
        }

        if (polygons.length > 0) {
            polygons.sort((a, b) => {
                if (a.length > b.length) {
                    return 1;
                } else if (a.length === b.length) {
                    return 0;
                } else {
                    return -1;
                }
            });
            this.polygons = [...polygons];
            let aimPolygon = polygons.pop();
            outerPolygon.push(this._convertPointsToPolygon(aimPolygon, chartNodeMap));
            let polygon2D = new Polygon2D(outerPolygon[0]);
            while (polygons.length > 0) {
                let target = polygons.pop();
                let converted = this._convertPointsToPolygon(target, chartNodeMap);
                let tmpP = new Polygon2D(converted);
                if (polygon2D.containsPolygon(tmpP)) {
                    let inSide = false;
                    for (let i = 0; i < innerPolygons.length; i++) {
                        let inner = new Polygon2D(innerPolygons[i]);
                        if (inner.containsPolygon(tmpP)) {
                            inSide = true;
                            break;
                        }
                    }
                    if (inSide === false) {
                        innerPolygons.push(converted);
                    }
                } else {
                    outerPolygon.push(converted);
                }
                tmpP.destroy();
            }
            polygon2D.destroy();
        }

        this.innerPolygon = innerPolygons;
        this.outerPolygon = outerPolygon;
    }

    loadBoundCircle(scalar, countNumber = 20) {
        if (!Check.Array(this.polygons)) {
            return undefined;
        }
        let ret = [];
        for (let i = this.polygons.length - 1; i >= 0; i--) {
            let target = this.polygons[i];
            let points = [];
            for (let j = 0; j < target.length; j++) {
                let node = target[j].node;
                let xy = node.getAttr("xy");
                points.push(new Point2D(xy.x, xy.y, 0));
            }
            let circle = new Circle2D();
            circle.fromPoints(points);
            circle.applyScalar(scalar);
            ret.push(circle.loadPoints(countNumber));
        }
        return ret;
    }

    _convertPointsToPolygon(polygon, chartNodeMap) {
        if (!Check.Array(polygon) || polygon.length <= 0) {
            return undefined;
        }
        let position = [];
        for (let i = 0; i < polygon.length; i++) {
            let current = polygon[i];
            let next = polygon[i + 1];
            if (next) {
                if (current.direction === next.direction) continue;
            }
            let target = polygon[i].node;
            let xy = target.getAttr("xy");
            let data = target.getAttr("value");
            position.push([xy.x, xy.y, data])
        }
        return position;
    }

    _updateIndex() {
        if (this.realMinY !== this.minY || this.realMinX !== this.minX || this.realMaxY !== this.maxY || this.realMaxX !== this.maxX) {
            let width = this.realMaxX - this.realMinX + 1;
            let height = this.realMaxY - this.realMinY + 1;
            let subNodes = [];

            this.width = width;
            this.height = height;
            this.minY = this.realMinY;
            this.maxX = this.realMaxX + 1;
            this.minX = this.realMinX;
            this.maxY = this.realMaxY + 1;

            for (let i = 0; i < this.nodeData.length; i++) {
                let target = this.nodeData[i];
                let xy = target.getAttr("xy");
                subNodes[this.originXYToIndex(xy.x, xy.y)] = target;
            }

            this.subNodes = subNodes;

            this.nodeData = this.nodeData.sort((a, b) => {
                let xyA = a.getAttr("xy");
                let xyB = b.getAttr("xy");
                if (xyA.y > xyB.y) {
                    return -1;
                } else if (xyA.y === xyB.y) {
                    if (xyA.x > xyB.x) {
                        return 1;
                    } else if (xyA.x === xyB.x) {
                        return 0;
                    } else {
                        return -1;
                    }
                } else {
                    return 1;
                }
            });
        }
    }
}