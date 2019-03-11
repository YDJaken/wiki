class StringUtil {
    /**
     * 删除某一位的字符
     * @param target
     * @param index
     * @return {*}
     */
    static removeIndex(target, index = 0) {
        let a = target.slice(index + 1);
        target = target.slice(0, index);
        return target + a;
    }

    /**
     * 删除一个范围内的字符串 不包含首尾
     * @param target
     * @param start
     * @param end
     * @return {*}
     */
    static removeRange(target, start, end) {
        let a = target.slice(end + 1);
        target = target.slice(0, start);
        return target + a;
    }

    /**
     * 在某一位后添加
     * @param target
     * @param index
     * @param add
     * @return {*}
     */
    static addInIndex(target, index, add) {
        let a = target.slice(index);
        target = target.slice(0, index);
        return target + add + a;
    }

    /**
     * 在某范围内添加,会删除范围内原字符
     * @param target
     * @param start
     * @param end
     * @param add
     * @return {*}
     */
    static addInRange(target, start, end, add) {
        let a = target.slice(end + 1);
        target = target.slice(0, start);
        return target + add + a;
    }

    /**
     * 仅为数字类字符串提供寻找最后一位的方法
     * @param target
     * @param start
     * @param check
     * @return {number}
     */
    static findLast(target, start, check) {
        for (let i = start; i < target.length; i++) {
            if (target.charAt(i) !== check && target.charAt(i) !== '.') return i - 1;
        }
        return target.length - 1;
    }

    /**
     * 移除所有的remove目标,假设所有的remove均相连
     * @param target
     * @param remove
     * @return {*}
     */
    static removeAll(target, remove) {
        let start = target.indexOf(remove);
        let end = StringUtil.findLast(target, start, remove);
        return StringUtil.removeRange(target, start, end);
    }

    /**
     * 删除最后一个字符
     * @param target
     * @return {string}
     */
    static removeLast(target) {
        return target.substring(0, target.length - 1);
    }
}

// export {StringUtil}
module.exports = StringUtil;
