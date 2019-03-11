/**
 * @Author DY
 */
import Check from "./Check.js";

export default class ObjectUtil {
    static merge(target, source) {
        let ret = ObjectUtil.copy(target);
        for (let name in source) {
            if (source.hasOwnProperty(name)) {
                if (!Check.checkDefined(ret[name])) {
                    ret[name] = source[name];
                }
            }
        }
        return ret;
    }

    static copy(object) {
        let ret = {};
        for (let name in object) {
            if (Check.Array(object[name])) {
                let tmp = [...object[name]];
                ret[name] = tmp;
            } else if (!Check.Object(object[name])) {
                ret[name] = object[name];
            } else {
                ret[name] = ObjectUtil.copy(object[name]);
            }
        }
        return ret;
    }

    static delete(object) {
        for (let name in object) {
            object[name] = null;
            delete object[name];
        }
    }

    static deleteComplete(object) {
        for (let name in object) {
            if (Check.Object(object[name])) ObjectUtil.deleteComplete(object[name]);
            object[name] = null;
            delete object[name];
        }
    }
}
