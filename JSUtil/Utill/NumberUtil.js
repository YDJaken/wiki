/**
 * @Author DY
 */


export default class NumberUtil {
    /**
     * 归一化
     * @param differ
     * @param min
     * @param target
     * @return {number}
     */
    static normalize(differ, min, target) {
        return (target - min) / differ;
    }

    static RandomUint8(number) {
        let ret = new Uint8Array(number);
        for (let i = 0; i < number; i++) {
            ret[i] = Math.round(Math.random() * 255.0);
        }
        return ret;
    }
}
