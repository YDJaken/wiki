/**
 * @Author DY
 */
import {dependencies} from "../Constants.js";
import Check from "./Check.js";

/**
 * @class ColorUtil
 * @classdesc 颜色转换工具类
 */
const rgbReg = /^rgb\((\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1})\)$/;
const rgbaReg = /^rgba\((\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\d+(\.\d+)?)\)$/;

export default class ColorUtil {
    /**
     * 16进制转rgba
     * @param hex
     * @param opacity
     * @return {{a: number, r: number, b: number, g: number}}
     */
    static hex2Rgba(hex, opacity = 1) {
        return {
            r: parseInt("0x" + hex.slice(1, 3)),
            g: parseInt("0x" + hex.slice(3, 5)),
            b: parseInt("0x" + hex.slice(5, 7)),
            a: hex.length > 7 ? parseInt("0x" + hex.slice(7, 9)) : opacity,
        };
    }

    /**
     * rgb转16进制
     * @param rgb
     * @return {string}
     */
    static rgb2Hex(rgb) {
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

    /**
     * rgba转16进制
     * @param rgba
     * @return {string}
     */
    static rgba2Hex(rgba) {
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

    /**
     * 16进制转cesium的color
     * @param hex
     * @param opacity
     * @return {Color|*}
     */
    static hex2CesiumColor(hex, opacity = 1) {
        if (!Check.checkDefined(hex)) {
            return new dependencies.Cesium.Color(1, 1, 1, opacity);
        }
        if (!Check.checkDefined(opacity)) {
            opacity = 1;
        }
        if (Check.Object(hex)) {
            return hex;
        }
        if (hex.indexOf('rgba') !== -1) {
            hex = ColorUtil.rgba2Hex(hex);
        } else if (hex.indexOf('rgb') !== -1) {
            hex = ColorUtil.rgb2Hex(hex);
        }
        if (!Check.checkDefined(hex)) {
            return new dependencies.Cesium.Color(1, 1, 1, opacity);
        }
        let r = parseInt("0x" + hex.slice(1, 3));
        let g = parseInt("0x" + hex.slice(3, 5));
        let b = parseInt("0x" + hex.slice(5, 7));
        if (hex.length > 7) {
            let a = parseInt("0x" + hex.slice(7, 9));
            return new dependencies.Cesium.Color(r / 255, g / 255, b / 255, a / 255);
        } else {
            return new dependencies.Cesium.Color(r / 255, g / 255, b / 255, opacity);
        }

    }

    static hexArray2CesiumColor(hex) {
        if (Check.Array(hex)) {
            let ret = [];
            for (let i = 0; i < hex.length; i++) {
                ret.push(ColorUtil.hex2CesiumColor(hex[i]));
            }
            return ret;
        } else {
            ColorUtil.hex2CesiumColor(hex);
        }
    }

    /**
     * cesium的color转16进制
     * @param color
     * @return {string}
     */
    static CesiumColor2hex(color) {
        if (Check.checkDefined(color)) {
            let r = color.red;
            let g = color.green;
            let b = color.blue;
            let hex = ColorUtil.rgb2Hex('rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')');
            return hex.toLocaleUpperCase()
        } else {
            let hex = ColorUtil.rgb2Hex('rgb(' + 255 + ',' + 255 + ',' + 255 + ')');
            return hex.toLocaleUpperCase()
        }
    }

    static fastLerp(normalizedValue, leftColor, rightColor) {
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

    static getColor(color, type = 'n') {
        if (type === 'n') {
            return dependencies.Cesium.Color[color]
        } else if (type === 's') {
            return dependencies.Cesium.ColorGeometryInstanceAttribute.fromColor(dependencies.Cesium.Color[color].withAlpha(0.5))
        }
    }

    static _getColor(color) {
        if (color === undefined) return dependencies.Cesium.Color.WHITE;
        if (typeof color === 'object') return color;
        if (Array.isArray(color)) {
            if (color.length === 3) return new dependencies.Cesium.Color(color[0], color[1], color[2]);
            if (color.length === 4) return new dependencies.Cesium.Color(color[0], color[1], color[2], color[3]);
        }
        if (typeof color === "number") return new dependencies.Cesium.Color(color);
        if (color.indexOf('0') === -1) {
            return dependencies.Cesium.Color[color.toLocaleUpperCase()];
        } else {
            return new dependencies.Cesium.Color(color);
        }
    }

    static getGeoInsColor(color) {
        return dependencies.Cesium.ColorGeometryInstanceAttribute.fromColor(ColorUtil._getColor(color));
    }
}

function lerpNumber(a, b, p) {
    return a + (b - a) * p;
}