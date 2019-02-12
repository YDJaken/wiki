/**
 * @Author DongYi
 */

class Check {
    /**
     * 检测入参是否正确定义
     * @param obj
     * @return {boolean}
     */
    static undefine(obj) {
        return obj === undefined || obj === null;
    }

    /**
     * 检查和同步属性
     * @param obj
     * @param defaultsetting
     * @return {*}
     */
    static checkInput(obj, defaultsetting) {
        for (let name in defaultsetting) {
            if (!obj[name]) {
                obj[name] = defaultsetting[name];
            }
        }
        return obj;
    }

    /**
     * 检查input是否是object类型
     * @param input
     * @param msg
     * @return {*}
     */
    static object(input, msg = '') {
        if (input === undefined || input === null || input === '') return undefined;
        if (typeof (input) === 'object' || (input instanceof Object)) {
            return input;
        } else {
            if (msg !== '') {
                console.warn(msg);
            }
            return undefined;
        }
    }

    /**
     * 检查input是否是string类型或者转换为string类型
     * @param input
     * @param msg 错误时返回的报告
     * @return {String}
     */
    static string(input, msg = '') {
        if (input === undefined || input === null || input === '') return undefined;
        if (typeof(input) === 'string' || (input instanceof String)) {
            return input
        } else {
            if (Array.isArray(input)) {
                input = input.toLocaleString();
            } else {
                if (input.toString) {
                    input = input.toString();
                } else {
                    if (msg !== '') {
                        console.warn(msg);
                    }
                    return undefined;
                }
            }
            return input;
        }
    }

    /**
     * 检查input是否是number类型或者可以转换为number类型
     * @param input
     * @param msg 错误时返回的报告
     * @returns input 或者转换后的input 如果都不为number类型返回 undefined
     */
    static number(input, msg = '') {
        if (input === undefined || input === null || input === '') return undefined;
        if (typeof (input) !== 'number') {
            if (Check.isNumber(input)) {
                input = ~~input;
                if (typeof (input) !== 'number') {
                    if (msg !== '') {
                        console.warn(msg);
                    }
                    return undefined;
                } else {
                    return input;
                }
            } else {
                if (msg !== '') {
                    console.warn(msg);
                }
                return undefined;
            }
        } else {
            return input;
        }
    }

    /**
     * 检查input是否是function类型
     * @param input
     * @param msg
     * @return {*}
     */
    static function(input, msg = '') {
        if (input === undefined || input === null || input === '') return undefined;
        if (typeof (input) !== 'function' && (input instanceof Function) === false) {
            if (msg !== '') {
                console.warn(msg);
            }
            return undefined;
        } else {
            return input;
        }
    }

    /**
     * 判断input是否可以转化为数字,前提是input不是number类型
     * @param input
     */
    static isNumber(input) {
        if (input === undefined || input === null || input === '') return undefined;
        if (typeof (input) !== 'string' && (input instanceof String) === false) {
            return false;
        }
        if (input.indexOf('.') !== input.lastIndexOf('.')) {
            return false;
        }
        if (input.indexOf('-') !== input.lastIndexOf('-')) {
            return false;
        }
        for (let i = 0; i < input.length; i++) {
            if (input[i] > '9' || input[i] < '0') {
                if (input[i] !== '.' && input[i] !== '-') {
                    return false;
                }
            }
        }
        return true;
    }
}

/*module.exports = Check;*/
export {Check}