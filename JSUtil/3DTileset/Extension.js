/**
 * 3D Tiles基础数据类 - Extension
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";

class Extension {
    constructor(obj) {
        obj = Check.object(obj, 'Extension:请输入Extension对象。');
        if (Check.undefine(obj)) return;
        // 是否为拓展模块
        this.isExtension = true;
        // 记录拓展的内容
        this.data = obj;
    }

    /**
     * 将Extension对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        return `"${this.data.name}":{${this.data.toString()}`;
    }

    /**
     * 将传入的JSON对象变为Extension对象
     * @param obj
     * @return {BoundingVolume}
     */
    loadFromJSON(obj) {
        obj = Check.object(obj);
        if (Check.undefine(obj)) return;
        this.data = obj;
        return this;
    }
}

export {Extension}