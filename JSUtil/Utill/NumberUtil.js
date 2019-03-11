/**
 * @Author DY
 */
// import {StringUtil} from "./StringUtil";
var StringUtil = require('./StringUtil.js');

class NumberUtil {

    /**
     * 将输入的数字按照factor切分为多个小数组
     * @param number
     * @param factor
     * @return {Array}
     */
    static moveDegital(number, factor) {
        let number1 = Math.floor(number);
        let remain = number - number1;
        let ret = [];
        ret.push(number1);
        while (remain !== 0) {
            number1 = remain * factor;
            remain = number1 - Math.floor(number1);
            ret.push(Math.floor(number1));
        }
        return ret;
    }

    /**
     * 进行幂计算 缺少分配率
     * @param array
     * @param factor
     * @param pow
     */
    static powerFromArray(array, factor, pow) {
        if (array.length === 0) return console.log(`NumberUtil.powerFromArray:Array内无数字。`);
        for (let i = 0; i < array.length; i++) {
            if (array[i] >= factor && i !== 0) return console.log(`NumberUtil.powerFromArray:error。`);
            let power = Math.pow(factor, pow * i);
            if (!Number.isSafeInteger(power)) {
                let digt = ((factor + '').length - 1) * pow * i;
                let result = Math.pow(array[i], pow) + '';
                let total = result.length;
                let differ = digt - total;
                if (differ < 0) return console.log(`NumberUtil.powerFromArray:error。`);
                let ret = '0.';
                let w = 0;
                for (let j = 0; j < digt; j++) {
                    if (differ <= j) {
                        ret += result.charAt(w);
                        w++;
                    } else {
                        ret += '0';
                    }
                }
                array[i] = ret;
            } else {
                array[i] = Math.pow(array[i], pow) / power;
            }
        }
    }

    /**
     * 将计算后的数组重新组织
     * @param array
     * @return {Number|String}
     */
    static refromat(array) {
        let head = array[0];
        let total = array[array.length - 1];
        if (typeof  total === 'number') {
            for (let i = 1; i < array.length; i++) {
                head += array[i];
            }
            return head;
        } else {
            let length = total.length;
            let start = 0;
            for (let i = 1; i < array.length - 1; i++) {
                let tmp = array[i];
                if (typeof tmp === 'number') {
                    tmp = tmp.toString();
                    let index = tmp.indexOf('e');
                    if (index !== -1) {
                        let group = tmp.split('e');
                        tmp = StringUtil.removeIndex(group[0], 1);
                        for (let j = 1; j < Math.abs(Number(group[1])); j++) {
                            tmp = '0' + tmp;
                        }
                        tmp = '0.' + tmp;
                    }
                }
                let end = tmp.length - 1;
                tmp = StringUtil.removeAll(tmp, '0');
                start = end - tmp.length + 1;
                total = StringUtil.addInRange(total, start, end, tmp);
                start = end;
            }
            let tmp2 = (head + '');
            if (tmp2.indexOf('e') !== -1) {
                let group = tmp2.split('e');
                let size = Number(group[1]);
                let magnitude = StringUtil.removeIndex(group[0], 1);
                let bigIndex = magnitude.length - 1;
                for (let i = 0; i < size; i++) {
                    if (i >= bigIndex) magnitude += 0;
                }
                head = magnitude;
            }
            total = StringUtil.removeIndex(total);
            head = head + total;
            return head;
        }
    }

    static origin(array, factor, pow) {
        if (array.length === 0) return console.log(`NumberUtil.powerFromArray:Array内无数字。`);
        for (let i = 0; i < array.length; i++) {
            if (array[i] >= factor && i !== 0) return console.log(`NumberUtil.powerFromArray:error。`);
            let power = Math.pow(factor, pow * i);
            array[i] = Math.pow(array[i], pow) / power;
        }
    }

}

//export {NumberUtil}

module.exports = NumberUtil;
