/**
 * @Author DY
 */
export default class ArrayUtil {

    /**
     * 检测数组内是否存在目标项
     * @param Array
     * @param target
     * @returns {Number}
     */
    static contains(Array, target) {
        return Array.indexOf(target);
    }

    /**
     * 删除某一位置
     * @param index
     * @param Array
     * @return {*} 被删除的元素
     */
    static removeIndex(index, Array) {
        if (index === 0) {
            return Array.shift();
        }
        if (index === Array.length - 1) {
            return Array.pop();
        }
        return Array.splice(index, 1);
    }

    /**
     * 添加某一位置
     * @param index
     * @param Array
     * @param item
     */
    static addIndex(index, Array, item) {
        if (index === 0) {
            return Array.unshift(item);
        }
        if (index === Array.length) {
            return Array.push(item);
        }
        return Array.splice(index, 0, item);
    }

    /**
     * 从某一位置开始向数组添加另一数组
     * @param index
     * @param Array
     * @param inputArray
     * @return {*}
     */
    static addArray(index, Array, inputArray) {
        for (let i = 0; i < inputArray.length; i++) {
            ArrayUtil.addIndex(index++, Array, inputArray[i]);
        }
        return Array;
    }

    /**
     * 删除Array内的indexArray
     * @param {Array} indexArray
     * @param Array
     * @param offset
     */
    static removeSome(indexArray, Array, offset = 0) {
        indexArray = indexArray.sort();
        let count = offset;
        for (let i = 0; i < indexArray.length; i++) {
            ArrayUtil.removeIndex((indexArray[i] - count), Array);
            count++;
        }
        return Array;
    }

    /**
     * 交换数组中的两个元素的位置
     * @param index
     * @param target
     * @param Array
     */
    static swap(index, target, Array) {
        if (index === target) return Array;
        if (index < 0 || target < 0) return Array;
        let tmp = Array[index];
        Array[index] = Array[target];
        Array[target] = tmp;
        return Array;
    }
}
