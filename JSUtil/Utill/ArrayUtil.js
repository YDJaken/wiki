/**
 * @Author DY
 */
import Check from "./Check";

/**
 * @class ArrayUtil
 * @classdesc 操作数组的工具类
 */
export default class ArrayUtil {

    static findIndex(array, fun, aim = undefined) {
        if (!Check.function(fun)) {
            return -1;
        }
        if (!Check.Array(array)) {
            return -1;
        }
        let ret = -1;
        for (let i = 0; i < array.length; i++) {
            if (fun.call(aim, array[i], i)) {
                return i;
            }
        }
        return ret;
    }

    static findIndexLast(array, fun, aim = undefined) {
        if (!Check.function(fun)) {
            return -1;
        }
        if (!Check.Array(array)) {
            return -1;
        }
        let ret = -1;
        for (let i = array.length - 1; i >= 0; i--) {
            if (fun.call(aim, array[i], i)) {
                return i;
            }
        }
        return ret;
    }


    static computeAvg(array, min) {
        let len = array.length;
        if (len === 0) return 0;
        if (!min) {
            min = Infinity;
            for (let i = 0; i < len; i++) {
                min = Math.min(array[i], min);
            }
        }

        let sum = 0;
        for (let i = 0; i < len; i++) {
            sum = sum + (array[i] - min);
        }

        return (min + sum / len) / 1000.0;
    }

    /**
     * 检测数组内是否存在目标项
     * @param array
     * @param target
     * @returns {Number}
     */
    static contains(array, target) {
        return array.indexOf(target);
    }

    /**
     * 删除某一位置
     * @param index
     * @param array
     * @return {*} 被删除的元素
     */
    static removeIndex(index, array) {
        if (index === -1) {
            return undefined;
        }
        if (index === 0) {
            return array.shift();
        }
        if (index === array.length - 1) {
            return array.pop();
        }
        return array.splice(index, 1)[0];
    }

    /**
     * 添加某一位置
     * @param index
     * @param array
     * @param item
     */
    static addIndex(index, array, item) {
        if (index === 0) {
            return array.unshift(item);
        }
        if (index === array.length) {
            return array.push(item);
        }
        return array.splice(index, 0, item);
    }

    /**
     * 从某一位置开始向数组添加另一数组
     * @param index
     * @param array
     * @param inputarray
     * @return {*}
     */
    static addArray(index, array, inputarray) {
        for (let i = 0; i < inputarray.length; i++) {
            ArrayUtil.addIndex(index++, array, inputarray[i]);
        }
        return array;
    }

    /**
     * 删除Array内的indexArray
     * @param {Array} indexArray
     * @param array
     * @param offset
     */
    static removeSome(indexarray, array, offset = 0) {
        indexarray = indexarray.sort();
        let count = 0;
        for (let i = 0; i < indexarray.length; i++) {
            ArrayUtil.removeIndex(Math.max(indexarray[i] - count + offset, 0), array);
            count++;
        }
        return array;
    }

    /**
     * 交换数组中的两个元素的位置
     * @param index
     * @param target
     * @param array
     */
    static swap(index, target, array) {
        if (index === target) return array;
        if (index < 0 || target < 0) return array;
        let length = array.length;
        if (index >= length || target >= length) return array;
        let tmp = array[index];
        array[index] = array[target];
        array[target] = tmp;
        return array;
    }
}
