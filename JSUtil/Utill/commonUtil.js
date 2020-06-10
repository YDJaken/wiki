import {dependencies} from "../Constants";

/**
 * @class swapElements
 * @classdesc 交换数组中两个元素的位置
 * @param arr 数组
 * @param i 第一个元素index
 * @param j 第二个元素index
 */
export function swapElements(arr, i, j) {
    i = dependencies.Cesium.Math.clamp(i, 0, arr.length - 1)
    j = dependencies.Cesium.Math.clamp(j, 0, arr.length - 1)
    if (i === j) {
        return false
    }
    const temp = arr[i]
    arr.splice(i, 1, arr[j])
    arr.splice(j, 1, temp)
    return true
}
