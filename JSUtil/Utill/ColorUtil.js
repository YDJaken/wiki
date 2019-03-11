/**
 * @Author DY
 */
import {dependencies} from "../Constants.js";
import Check from "./Check.js";

export default class ColorUtil {
    //16进制转rgb
    static hex2Rgba(hex, opacity = 1) {
        return {
            r: parseInt("0x" + hex.slice(1, 3)),
            g: parseInt("0x" + hex.slice(3, 5)),
            b: parseInt("0x" + hex.slice(5, 7)),
            a: opacity,
        };
    }

    //rgb转16进制
    static rgb2Hex(rgb) {
        let hexColor = '#';
        let reg = /^rgb\((\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1}\,)(\s*[1-2]?[0-9]?[0-9]{1})\)$/;
        if (reg.test(rgb)) {
            let matches = reg.exec(rgb);
            for (let i = 1; i <= 3; i++) {
                if (parseInt(matches[i]) < 16) {
                    hexColor += '0' + parseInt(matches[i]).toString(16);
                } else {
                    hexColor += parseInt(matches[i]).toString(16);
                }
            }
        }
        return hexColor.toLocaleUpperCase();
    }

    //16进制转cesium的color
    static hex2CesiumColor(hex, opacity = 1) {
        if (!Check.checkDefined(hex)) {
            return new dependencies.Cesium.Color(1, 1, 1, opacity);
        }
        let r = parseInt("0x" + hex.slice(1, 3));
        let g = parseInt("0x" + hex.slice(3, 5));
        let b = parseInt("0x" + hex.slice(5, 7));
        return new dependencies.Cesium.Color(r / 255, g / 255, b / 255, opacity);
    }

    //cesium的color转16进制
    static CesiumColor2hex(cesiumcolor) {
        if (Check.checkDefined(cesiumcolor)) {
            let r = cesiumcolor.red;
            let g = cesiumcolor.green;
            let b = cesiumcolor.blue;
            let hex = ColorUtil.rgb2Hex('rgb(' + r * 255 + ',' + g * 255 + ',' + b * 255 + ')');
            return hex.toLocaleUpperCase()
        } else {
            let hex = ColorUtil.rgb2Hex('rgb(' + 255 + ',' + 255 + ',' + 255 + ')');
            return hex.toLocaleUpperCase()
        }
    }
}