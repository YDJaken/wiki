/**
 * @Author DY
 */
/**
 * @class Check
 * @classdesc 检查参数属性和一些安全配置的工具类
 */
import {
    detectDevTools_id,
    onDevToolsOpen,
    is_firefox,
    is_Chrom,
    is_edge,
    is_ie,
    log,
    getTimestamp,
    clear,
    dependencies
} from '../Constants.js';

const element = document.createElement('th');
if (element.__defineGetter__) {
    element.__defineGetter__('id', function () {
        onDevToolsOpen();
    });
}
const r = /x/;
r.toString = function () {
    onDevToolsOpen();
};

export default class Check {
    /**
     * 检查传入参数是否已经定义
     * @param input
     * @returns {Boolean}
     */
    static checkDefined(input) {
        return input !== undefined && input !== null;
    }


    /**
     * 检查传入参数是否为String 类型
     * @param input
     * @returns {Boolean}
     */
    static string(input) {
        return Check.checkDefined(input) && (typeof input === 'string' || input instanceof String);
    }

    /**
     * 检查传入参数是否为number 类型
     * @param input
     * @returns {Boolean}
     */
    static number(input) {
        return Check.checkDefined(input) && (typeof input === 'number' || input instanceof Number) && !Number.isNaN(input);
    }

    /**
     * 检查传入参数是否为function 类型
     * @param input
     * @returns {Boolean}
     */
    static function(input) {
        return Check.checkDefined(input) && (typeof (input) === 'function' || (input instanceof Function));
    }

    /**
     * 检查入参是否为Array
     * @param input
     * @returns {Boolean}
     */
    static Array(input) {
        return Check.checkDefined(input) && Array.isArray(input);
    }

    /**
     * 判断在范围内
     * @param min
     * @param max
     * @param input
     * @return {Boolean}
     */
    static inRange(min, max, input) {
        return input <= max && input >= min;
    }

    /**
     * 检查入参是否为Object
     * @param input
     * @returns {Boolean}
     */
    static Object(input) {
        return Check.checkDefined(input) && (typeof (input) === 'object' || (input instanceof Object));
    }


    static DevTool(forceLog = false) {
        if (console.log !== log || (clear() !== -12345 && console.clear !== clear)) {
            onDevToolsOpen();
            return;
        }
        let a = clear();
        if (forceLog === true || a !== -12345) {
            if (is_firefox) {
                log(r);
            } else {
                log(element);
            }
        }
    }

    static loopDetact() {
        if (detectDevTools_id.id === -1) {
            detectDevTools_id.id = setInterval(function () {
                Check.DevTool();
            }, 2500)
        }
    }
}

Check.DevTool(true);
Check.loopDetact();
