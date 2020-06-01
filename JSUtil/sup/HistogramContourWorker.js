/**
 * @Author DY
 */
import Interpolation from "../../despUtil/Math/Interpolation";
import ChartNodeMap from "./ChartNodeMap";

if (typeof self === "undefined") {
    self = {};
}
const rgbReg = /^rgb\((\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1})\)$/;
const rgbaReg = /^rgba\((\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\d+(\.\d+)?)\)$/;

function lerpNumber(a, b, p) {
    return a + (b - a) * p;
}

function checkDefined(input) {
    return input !== undefined && input !== null;
}

function fastLerp(normalizedValue, leftColor, rightColor) {
    if (normalizedValue <= 0) {
        return leftColor;
    }
    if (normalizedValue >= 1) {
        return rightColor;
    }
    let out = {};

    let dv = normalizedValue;
    out.red = lerpNumber(leftColor.red, rightColor.red, dv);
    out.green = lerpNumber(leftColor.green, rightColor.green, dv);
    out.blue = lerpNumber(leftColor.blue, rightColor.blue, dv);
    out.alpha = lerpNumber(leftColor.alpha, rightColor.alpha, dv);

    return out;
}


function _checkValid(number) {
    return number !== -1 && number !== Infinity;
}

function rgba2Hex(rgba) {
    let hexColor = '#';
    if (rgbaReg.test(rgba)) {
        let matches = rgbaReg.exec(rgba);
        for (let i = 1; i <= 4; i++) {
            let tmp = Number.parseFloat(matches[i]);
            if (i === 4) {
                tmp = Math.round(tmp * 255);
            }
            if (tmp < 16) {
                hexColor += '0' + tmp.toString(16);
            } else {
                hexColor += tmp.toString(16);
            }
        }
    } else {
        return undefined;
    }
    return hexColor.toLocaleUpperCase();
}

function rgb2Hex(rgb) {
    let hexColor = '#';
    if (rgbReg.test(rgb)) {
        let matches = rgbReg.exec(rgb);
        for (let i = 1; i <= 3; i++) {
            let tmp = Number.parseFloat(matches[i]);
            if (tmp < 16) {
                hexColor += '0' + tmp.toString(16);
            } else {
                hexColor += tmp.toString(16);
            }
        }
    } else {
        return undefined;
    }
    return hexColor.toLocaleUpperCase();
}

function CesiumColor2hex(color) {
    if (checkDefined(color)) {
        let r = color.red;
        let g = color.green;
        let b = color.blue;
        let hex = rgb2Hex('rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')');
        return hex.toLocaleUpperCase()
    } else {
        let hex = rgb2Hex('rgb(' + 255 + ',' + 255 + ',' + 255 + ')');
        return hex.toLocaleUpperCase()
    }
}

function Object(input) {
    return checkDefined(input) && (typeof (input) === 'object' || (input instanceof Object));
}

function hex2CesiumColor(hex, opacity = 1) {
    if (!checkDefined(hex)) {
        let out = {};
        out.red = 1;
        out.green = 1;
        out.blue = 1;
        out.alpha = opacity;
        return out;
    }
    if (!checkDefined(opacity)) {
        opacity = 1;
    }
    if (Object(hex)) {
        return hex;
    }
    if (hex.indexOf('rgba') !== -1) {
        hex = rgba2Hex(hex);
    } else if (hex.indexOf('rgb') !== -1) {
        hex = rgb2Hex(hex);
    }
    if (!checkDefined(hex)) {
        let out = {};
        out.red = 1;
        out.green = 1;
        out.blue = 1;
        out.alpha = opacity;
        return out;
    }
    let r = parseInt("0x" + hex.slice(1, 3));
    let g = parseInt("0x" + hex.slice(3, 5));
    let b = parseInt("0x" + hex.slice(5, 7));
    if (hex.length > 7) {
        let a = parseInt("0x" + hex.slice(7, 9));
        let out = {};
        out.red = r / 255;
        out.green = g / 255;
        out.blue = b / 255;
        out.alpha = a / 255;
        return out;
    } else {
        let out = {};
        out.red = r / 255;
        out.green = g / 255;
        out.blue = b / 255;
        out.alpha = opacity;
        return out;
    }

}

function inRange(min, max, input) {
    return input <= max && input >= min;
}

self.XYtoIndex = (x, y) => {
    if (x < 0 || y < 0) {
        return -1;
    }
    if (y >= self.imgHeight || x >= self.imgWidth) {
        return Infinity;
    }
    return self.imgWidth * y + x;
}

self._getImgColor = (value) => {
    let index = self._getIndex(value);
    if (self.heatmap === false) {
        return self._getColorObj(index);
    } else {
        value = (value - self.min) - index * self.differ;
        let minColor = self._getColorObj(index);
        let maxColor = self._getColorObj(Math.min(self.colorArray.length - 1, index + 1));
        let ratio = value / self.differ;
        return fastLerp(ratio, minColor, maxColor);
    }
}

self._getColor = (index) => {
    return CesiumColor2hex(self._getColorObj(index));
}

self._getColorObj = (index) => {
    let aim = (index / self.splitNumber) * self.colorArray.length;
    let sub = Math.floor(aim);
    let minColor = self.colorArray[sub];
    sub = aim - sub;
    let maxColor = self.colorArray[Math.min(self.colorArray.length - 1, Math.ceil(aim))];
    minColor = hex2CesiumColor(minColor);
    maxColor = hex2CesiumColor(maxColor);
    return fastLerp(sub, minColor, maxColor);
}


self._getIndex = (value) => {
    let CD = value - self.min;
    if (CD <= 0) {
        return 0;
    } else {
        return Math.min(self.splitNumber - 1, Math.floor(CD / self.differ));
    }
}

self._testCase = (valueX, valueY) => {
    let differ = 1;
    return inRange(differ, self.imgWidth - differ, valueX) && inRange(differ, self.imgHeight - differ, valueY)
}

self._showNode = (nodeData, index, value, ctx) => {
    for (let i = 0; i < nodeData.length; i++) {
        let target = nodeData[i];
        for (let j = 0; j < target.length; j++) {
            let subTarget = target[j];
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0,0,0,0.75)'
            let first = subTarget[0];
            ctx.moveTo(first[0], first[1]);
            let half = Math.round(subTarget.length / 2);
            for (let k = 1; k < subTarget.length; k++) {
                let realTarget = subTarget[k];
                if (k === half) {
                    if (self._testCase(realTarget[0], realTarget[1])) {
                        ctx.font = `bold 1rem "Fira Sans", sans-serif`;
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = 'rgba(0,0,0,1)'
                        ctx.fillText(value.toFixed(2) + "", realTarget[0], realTarget[1]);
                        // ret.push([realTarget[0], realTarget[1], value])
                    } else {
                        let index = 1;
                        let tmpTarget = subTarget[index];
                        while (index < subTarget.length && !self._testCase(tmpTarget[0], tmpTarget[1])) {
                            index++;
                            tmpTarget = subTarget[index];
                        }
                        if (tmpTarget) {
                            ctx.font = `bold 1rem "Fira Sans", sans-serif`;
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = 'rgba(0,0,0,1)'
                            ctx.fillText(value.toFixed(2) + "", tmpTarget[0], tmpTarget[1]);
                        }
                    }
                }
                ctx.lineTo(realTarget[0], realTarget[1]);
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}

self._loadPolygons = (chartNodeMap, ctx) => {
    let polygons = chartNodeMap.polygons;
    if (Array.isArray(polygons)) {
        for (let i = 0; i < polygons.length; i++) {
            let target = polygons[i];
            let index = self._getIndex(target.value);
            self._showNode(target.arrays, index, target.value, ctx);
        }
    }
}

self.onmessage = (e) => {
    let chartObj = e.data;
    if (!chartObj || !Array.isArray(chartObj) || chartObj.length !== 12) return;
    self.data = chartObj[0];
    let imgWidth = chartObj[1];
    let imgHeight = chartObj[2];
    self.scalar = chartObj[3];
    self.colorArray = chartObj[4];
    self.heatmap = chartObj[5];
    self.imgWidth = chartObj[6];
    self.imgHeight = chartObj[7];
    self.max = chartObj[8];
    self.min = chartObj[9];
    self.differ = chartObj[10];
    self.splitNumber = chartObj[11];

    function OriginXYtoIndex(x, y) {
        if (x < 0 || y < 0) {
            return -1;
        }
        if (y >= imgHeight || x >= imgWidth) {
            return Infinity;
        }
        return imgWidth * y + x;
    }

    let allImageData = new Uint8ClampedArray(self.imgWidth * self.imgHeight * 4);
    let imgDatas = new Array(self.imgHeight * self.imgWidth);
    for (let j = 0; j < self.imgHeight; j++) {
        for (let i = 0; i < self.imgWidth; i++) {
            let value;
            let imgData;
            if (self.scalar === 1) {
                let g00 = {x: i, y: j};
                let g00Value = OriginXYtoIndex(g00.x, g00.y);
                value = self.data[g00Value];
            } else {
                let dx = i / self.scalar;
                let dy = j / self.scalar;
                let g00 = {x: Math.floor(dx), y: Math.floor(dy)};
                dx = dx - g00.x;
                dy = dy - g00.y;
                let g00Value = OriginXYtoIndex(g00.x, g00.y);
                let g01 = {x: g00.x, y: g00.y + 1};
                let g01Value = OriginXYtoIndex(g01.x, g01.y);
                let g10 = {x: g00.x + 1, y: g00.y};
                let g10Value = OriginXYtoIndex(g10.x, g10.y);
                let g11 = {x: g00.x + 1, y: g00.y + 1};
                let g11Value = OriginXYtoIndex(g11.x, g11.y);

                let testCase = _checkValid(g00Value) && _checkValid(g01Value);
                if (testCase && _checkValid(g10Value) && _checkValid(g11Value)) {
                    g00Value = self.data[g00Value];
                    g01Value = self.data[g01Value];
                    g10Value = self.data[g10Value];
                    g11Value = self.data[g11Value];
                    value = Interpolation.BilinearInterpolation(g00Value, g10Value, g01Value, g11Value, dx, dy);
                } else if (testCase) {
                    g00Value = self.data[g00Value];
                    g01Value = self.data[g01Value];
                    value = Interpolation.LinearInterpolation(g00Value, g01Value, dy);
                } else if (_checkValid(g00Value) && _checkValid(g10Value)) {
                    g00Value = self.data[g00Value];
                    g10Value = self.data[g10Value];
                    value = Interpolation.LinearInterpolation(g00Value, g10Value, dx);
                } else {
                    value = self.data[g00Value];
                }
            }
            imgData = self._getImgColor(value);
            let xy = {x: i, y: j};
            let imgIndex = self.XYtoIndex(xy.x, self.imgHeight - xy.y - 1);
            imgDatas[imgIndex] = value;
            imgIndex = imgIndex * 4;
            allImageData[imgIndex++] = Math.floor(imgData.red * 255);
            allImageData[imgIndex++] = Math.floor(imgData.green * 255);
            allImageData[imgIndex++] = Math.floor(imgData.blue * 255);
            allImageData[imgIndex] = Math.floor(imgData.alpha * 255);
        }
    }

    let chartNodeMap = new ChartNodeMap({
        nodeData: imgDatas,
        width: self.imgWidth,
        height: self.imgHeight,
        max: self.max,
        min: self.min,
        differ: self.differ,
        splitNumber: self.splitNumber
    });
    chartNodeMap.promise.then(() => {
        let canvas = new OffscreenCanvas(self.imgWidth, self.imgHeight);
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 2.0;
        ctx.putImageData(new ImageData(allImageData, self.imgWidth, self.imgHeight), 0, 0);
        self._loadPolygons(chartNodeMap, ctx);
        canvas.convertToBlob().then((data) => {
            self.postMessage({status: 'success', data: URL.createObjectURL(data)});
        }, (error) => {
            self.postMessage({status: 'fail', data: error});
        });
    }, (error) => {
        self.postMessage({status: 'fail', data: error});
    });
};
