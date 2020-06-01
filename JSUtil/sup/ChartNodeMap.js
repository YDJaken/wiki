import * as Contour from "./FindContour";

/**
 * @Author DY
 */
function _checkValid(number) {
    return number !== -1 && number !== Infinity;
}

function checkDefined(input) {
    return input !== undefined && input !== null;
}

function number(input) {
    return checkDefined(input) && (typeof input === 'number' || input instanceof Number) && !Number.isNaN(input);
}

export default class ChartNodeMap {
    constructor(obj = {}) {
        // 此图中的数据点
        this.nodeData = checkDefined(obj.nodeData) ? obj.nodeData : [];
        // 此图中X坐标的个数
        this.width = checkDefined(obj.width) ? obj.width : 0;
        // 此图中Y坐标的个数
        this.height = checkDefined(obj.height) ? obj.height : 0;
        if (this.width * this.height !== this.nodeData.length) {
            throw new Error("The total number doesn't match.");
        }

        this.max = obj.max;
        this.min = obj.min;
        this.differ = obj.differ;
        this.splitNumber = obj.splitNumber;
        this.symbolSize = number(obj.symbolSize) ? obj.symbolSize : 1;

        this._reformRegion();
    }

    nodeTopLeftPoint(node) {
        let xy = node.getAttr("xy");
        return [[xy.x + this.symbolSize, xy.y, node.getAttr("value")]];
    }

    nodeTopRightPoint(node) {
        let xy = node.getAttr("xy");
        return [[xy.x + this.symbolSize, xy.y + this.symbolSize, node.getAttr("value")]];
    }

    nodeBottomLeftPoint(node) {
        let xy = node.getAttr("xy");
        return [[xy.x, xy.y, node.getAttr("value")]];
    }

    nodeBottomRightPoint(node) {
        let xy = node.getAttr("xy");
        return [[xy.x, xy.y + this.symbolSize, node.getAttr("value")]];
    }


    _getIndex(value) {
        let CD = value - this.min;
        if (CD <= 0) {
            return 0;
        } else {
            return Math.min(this.splitNumber - 1, Math.floor(CD / this.differ));
        }
    }

    XYtoIndex(x, y) {
        if (x < 0 || y < 0) {
            return -1;
        }
        if (y >= this.height || x >= this.width) {
            return Infinity;
        }
        return this.width * y + x;
    }

    indexToXY(index) {
        if (index < 0) return undefined;
        let y = Math.floor(index / this.width);
        let x = index % this.width;
        return {x: x, y: y};
    }

    _testPolygon(node, polygon) {
        if (checkDefined(node) && checkDefined(polygon)) {
            let nodeIndex = this._getIndex(node.getAttr("value"));
            return node.getAttr("polygon") !== polygon && polygon.index === nodeIndex;
        }
        return false;
    }

    _testNode(node) {
        return checkDefined(node);
    }

    _reformRegion() {
        this.promise = new Promise((resolve, reject) => {
            let range = [];

            for (let i = 0; i < this.splitNumber; i++) {
                range.push(this.min + this.differ * i)
            }

            range.push(this.max);
            this.polygons = Contour.contours()
                .size([this.width, this.height])
                .thresholds(range)
                (this.nodeData);
            resolve();
        })
    }

    getNodeData(x, y) {
        let g00 = this.XYtoIndex(x, y);
        if (_checkValid(g00)) {
            return this.nodeData[g00];
        } else {
            return undefined;
        }
    }

    loadNodeByDirection(node, direction) {
        if (!number(direction) || !number(direction)) {
            return undefined;
        }
        let xy = node.getAttr("xy");
        let ret = {x: xy.x, y: xy.y};
        switch (direction) {
            case 0:
                return this.getNodeData(xy.x, xy.y);
            case 1:
                return this.getNodeData(xy.x - 1, xy.y + 1);
            case 2:
                return this.getNodeData(xy.x, xy.y + 1);
            case 3:
                return this.getNodeData(xy.x + 1, xy.y + 1);
            case 4:
                return this.getNodeData(xy.x + 1, xy.y);
            case 5:
                return this.getNodeData(xy.x + 1, xy.y - 1);
            case 6:
                return this.getNodeData(xy.x, xy.y - 1);
            case 7:
                return this.getNodeData(xy.x - 1, xy.y - 1);
            case 8:
                return this.getNodeData(xy.x - 1, xy.y);

        }
    }

    _markAround(polygon, node) {
        let xy = node.getAttr("xy");
        let up = this.loadNodeByDirection(node, 2);
        let down = this.loadNodeByDirection(node, 6);
        let left = this.loadNodeByDirection(node, 8);
        let right = this.loadNodeByDirection(node, 4);

        if (this._testPolygon(up, polygon)) {
            let tmpPolygon = up.getAttr("polygon");
            if (checkDefined(tmpPolygon)) {
                if (polygon.size >= tmpPolygon.size) {
                    polygon.merge(tmpPolygon);
                    tmpPolygon.destroy();
                } else {
                    tmpPolygon.merge(polygon);
                    polygon.destroy();
                    polygon = tmpPolygon;
                }
            } else {
                let tmpXY = up.getAttr("xy");
                polygon.addNewNode(up, tmpXY.x, tmpXY.y);
            }
        }

        if (this._testPolygon(down, polygon)) {
            let tmpPolygon = down.getAttr("polygon");
            if (checkDefined(tmpPolygon)) {
                if (polygon.size >= tmpPolygon.size) {
                    polygon.merge(tmpPolygon);
                    tmpPolygon.destroy();
                } else {
                    tmpPolygon.merge(polygon);
                    polygon.destroy();
                    polygon = tmpPolygon;
                }
            } else {
                let tmpXY = down.getAttr("xy");
                polygon.addNewNode(down, tmpXY.x, tmpXY.y);
            }
        }
        if (this._testPolygon(left, polygon)) {
            let tmpPolygon = left.getAttr("polygon");
            if (checkDefined(tmpPolygon)) {
                if (polygon.size >= tmpPolygon.size) {
                    polygon.merge(tmpPolygon);
                    tmpPolygon.destroy();
                } else {
                    tmpPolygon.merge(polygon);
                    polygon.destroy();
                    polygon = tmpPolygon;
                }
            } else {
                let tmpXY = left.getAttr("xy");
                polygon.addNewNode(left, tmpXY.x, tmpXY.y);
            }
        }
        if (this._testPolygon(right, polygon)) {
            let tmpPolygon = right.getAttr("polygon");
            if (checkDefined(tmpPolygon)) {
                if (polygon.size >= tmpPolygon.size) {
                    polygon.merge(tmpPolygon);
                    tmpPolygon.destroy();
                } else {
                    tmpPolygon.merge(polygon);
                    polygon.destroy();
                    polygon = tmpPolygon;
                }
            } else {
                let tmpXY = right.getAttr("xy");
                polygon.addNewNode(right, tmpXY.x, tmpXY.y);
            }
        }
    }

    _findBoundary() {
        for (let i = 0; i < this.polygons.length; i++) {
            let target = this.polygons[i];
            target.loadBoundary(this);
        }
    }
}