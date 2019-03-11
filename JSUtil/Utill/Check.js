/**
 * @Author DY
 */
export default class Check {
    /**
     * 检查传入参数是否已经定义
     * @param input
     * @returns {boolean}
     */
    static checkDefined(input) {
        return input !== undefined && input !== null;
    }


    /**
     * 检查传入参数是否为String 类型
     * @param input
     * @returns {boolean}
     */
    static string(input) {
        return Check.checkDefined(input) && (typeof input === 'string' || input instanceof String);
    }

    /**
     * 检查传入参数是否为number 类型
     * @param input
     * @returns {boolean}
     */
    static number(input) {
        return Check.checkDefined(input) && (typeof input === 'number' || input instanceof Number);
    }

    /**
     * 检查传入参数是否为function 类型
     * @param input
     * @returns {boolean}
     */
    static function(input) {
        return Check.checkDefined(input) && (typeof (input) === 'function' || (input instanceof Function));
    }

    /**
     * 检查入参是否为Array
     * @param input
     * @returns {boolean}
     */
    static Array(input) {
        return Check.checkDefined(input) && Array.isArray(input);
    }

    /**
     * 判断在范围内
     * @param min
     * @param max
     * @param input
     * @return {boolean}
     */
    static inRange(min, max, input) {
        return input <= max && input >= min;
    }

    /**
     * 检查入参是否为Object
     * @param input
     * @returns {boolean}
     */
    static Object(input) {
        return Check.checkDefined(input) && (typeof (input) === 'object' || (input instanceof Object));
    }
}