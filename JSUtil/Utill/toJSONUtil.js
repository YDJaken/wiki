/**
 * @Author DY
 */

/**
 * @class toJSONUtil
 * @classdesc JSON工具类
 */
export default class toJSONUtil {
    /**
     * 将对象转换为JSON
     * @param obj
     * @return {string}
     */
    static toJSON(obj) {
        if (Array.isArray(obj)) {
            let ret = '[';
            for (let i = 0; i < obj.length; i++) {
                ret += toJSONUtil.toJSON(obj[i]);
                if (i !== obj.length - 1) ret += ',';
            }
            ret += ']';
            return ret;
        } else if (typeof obj === 'object') {
            let ret = '{';
            for (let name in obj) {
                if (Array.isArray(obj[name])) {
                    ret += `"${name}":[`;
                    for (let i = 0; i < obj[name].length; i++) {
                        ret += toJSONUtil.toJSON(obj[name][i]);
                        if (i !== obj[name].length - 1) ret += ','
                    }
                    ret += ']';
                } else if (typeof obj[name] === "object") {
                    ret += `"${name}":${toJSONUtil.toJSON(obj[name])}`;
                } else if (typeof obj[name] === "number") {
                    ret += `"${name}":${obj[name]}`
                } else {
                    ret += `"${name}":"${obj[name]}"`
                }
                ret += ','
            }
            ret = ret.substring(0, ret.length - 1);
            ret += '}';
            return ret;
        } else if (obj === undefined) {
            return "undefined";
        } else if (obj === null) {
            return "null";
        } else {
            if (typeof obj === "number") {
                return obj.toString();
            }
            return `"${obj.toString()}"`;
        }
    }

    /**
     * 将对象转换为GeoJSON
     * @param Array
     * @param isPolygon
     * @return {Array[]|Array}
     */
    static toGeojson(Array, isPolygon = false) {
        let ret = [];
        for (let i = 0; i < Array.length; i += 3) {
            ret.push([Array[i], Array[i + 1]])
        }
        if (isPolygon) {
            ret.push([Array[0], Array[1]]);
            return [ret];
        } else {
            return ret;
        }
    }

    static toGeojson2D(Array, isPolygon = false) {
        let ret = [];
        for (let i = 0; i < Array.length; i += 2) {
            ret.push([Array[i], Array[i + 1]])
        }
        if (isPolygon) {
            ret.push([Array[0], Array[1]]);
            return [ret];
        } else {
            return ret;
        }
    }
}
