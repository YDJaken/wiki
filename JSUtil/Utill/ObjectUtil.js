/**
 * @Author DY
 */
import Check from "./Check.js";
import ArrayUtil from "./ArrayUtil.js";

/**
 * @class ObjectUtil
 * @classdesc 对象操作工具类
 */
export default class ObjectUtil {

    /**
     * 获取目标的父类方法
     * @param target
     * @param time
     * @return {string[]}
     */
    static getSuperClass(target, time = 0) {
        let tmp = Object.getPrototypeOf(target);
        while (time > 0) {
            tmp = Object.getPrototypeOf(tmp);
            time--;
        }
        let targetOwn = Object.getOwnPropertyNames(tmp);
        tmp = tmp.__proto__;
        tmp = Object.getOwnPropertyNames(tmp);
        for (let i = 0; i < tmp.length; i++) {
            if (targetOwn.indexOf(tmp[i]) !== -1) {
                ArrayUtil.removeIndex(i--, tmp);
            }
        }
        return tmp;
    }

    /**
     * 根据规则设定属性
     * @param target
     * @param obj
     * @param source
     */
    static setProperties(target, obj, source) {
        let boolean = Check.Array(target);
        let temp = boolean ? target : Object.getOwnPropertyNames(Object.getPrototypeOf(target));
        for (let i = 0; i < temp.length; i++) {
            let name = temp[i];
            if (name === "setShow" || name === "setProperty" || name === "setAttr") continue;
            let index = name.indexOf("set");
            if (index === 0) {
                let tmp = name.slice(3);
                tmp = tmp.charAt(0).toLocaleLowerCase() + tmp.slice(1);
                if (Check.checkDefined(obj[tmp]) || (!boolean && !Check.checkDefined(target[tmp]) || (boolean && !Check.checkDefined(source[tmp])))) {
                    if (boolean === true) {
                        if (!Check.checkDefined(source[tmp]) || source[tmp] !== obj[tmp])
                            source[name](obj[tmp]);
                    } else {
                        target[name](obj[tmp]);
                    }
                }
            }
        }
        if (Check.checkDefined(target.setShow)) {
            target.setShow(obj.show !== false);
        }

    }

    /**
     * 合并对象
     * @param target
     * @param source
     * @return {any}
     */
    static merge(target, source) {
        let ret = Object.assign({}, target);
        for (let name in source) {
            if (source.hasOwnProperty(name)) {
                if (!Check.checkDefined(ret[name])) {
                    ret[name] = source[name];
                }
            }
        }
        return ret;
    }

    /**
     * 复制对象
     * @param object
     */
    static copy(object) {
        if (Check.Array(object)) {
            let ret = [];
            for (let i = 0; i < object.length; i++) {
                ret.push(ObjectUtil.copy(object[i]));
            }
            return ret;
        } else if (Check.Object(object)) {
            let ret = {};
            for (let name in object) {
                if (name === "collection") continue;
                if (object.hasOwnProperty(name)) {
                    if (Check.Array(object[name])) {
                        let tmpA = [];
                        for (let i = 0; i < object[name].length; i++) {
                            tmpA.push(ObjectUtil.copy(object[name][i]));
                        }
                        ret[name] = tmpA;
                    } else if (!Check.Object(object[name])) {
                        ret[name] = object[name];
                    } else {
                        ret[name] = ObjectUtil.copy(object[name]);
                    }
                }
            }
            return ret;
        }
        return object;
    }


    /**
     * 浅层删除
     * @param object
     */
    static delete(object) {
        if (!Check.checkDefined(object)) return;
        for (let name in object) {
            if (!object.hasOwnProperty(name)) continue;
            if (Check.Array(object[name])) {
                while (object[name].length > 0) {
                    let a = object[name].pop();
                    if (Check.Object(a)) {
                        if (a.destroy) {
                            try {
                                a.destroy();
                            } catch (e) {
                                ObjectUtil.delete(a);
                            }
                        } else {
                            ObjectUtil.delete(a);
                        }
                    } else {
                        a = null;
                    }
                }
            }
            object[name] = null;
            delete object[name];
        }
    }

    /**
     * 递归删除
     * @param object
     */
    static deleteComplete(object) {
        for (let name in object) {
            if (!object.hasOwnProperty(name)) continue;

            if (Check.Object(object[name])) {
                ObjectUtil.deleteComplete(object[name]);
            } else if (Check.Array(object[name])) {
                while (object[name].length > 0) {
                    ObjectUtil.deleteComplete(object[name].pop());
                }
            }
            try {
                object[name] = null;
                delete object[name];
            } catch (e) {
                return;
            }

        }
    }
}
