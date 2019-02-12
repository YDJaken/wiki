import {Check} from "../Check/Check.js";
import {Extension} from "./Extension.js";

/**
 * 3D Tiles基类
 * @Author DongYi
 */
class Basic {
    constructor() {
        // 用于索引拓展
        this.extensions = undefined;
        // 其他属性
        this.extras = undefined;
    }

    /**
     * 将Basic对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = '';
        if (this.extras !== undefined) {
            ret += `"extras":{${this.extras.toString()}}`;
        }
        if (this.extensions !== undefined) {
            if (ret !== '') {
                ret += ','
            }
            ret += '"extensions":{';
            let arr = [];
            for (let name in this.extensions) {
                arr.push(this.extensions[name].toJSON());
            }
            ret += arr.join(',');
            ret += '}';
        }
        return ret;
    }

    /**
     * 传入对应的Extension对象
     * @param extension
     */
    addExtensions(extension) {
        if (!extension.isExtension) {
            console.log('TilesetBasic:addExtensions传入参数不是支持的Extension');
            return;
        }
        this.extensions[extension.data.name] = extension;
    }

    /**
     * 将传入的JSON对象变为Basic对象
     * @param obj
     */
    loadFromJSON(obj) {
        obj = Check.object(obj);
        if (Check.undefine(obj)) return;
        for (let prop in obj) {
            switch (prop) {
                case 'extensions':
                    for (let name in obj.extensions) {
                        try {
                            obj.extensions[name].name;
                        } catch (e) {
                            obj.extensions[name].name = name;
                        }
                        this.addExtensions(new Extension(obj.extensions[name]));
                    }
                    break;
                case 'extras':
                    this.extras = obj.extras;
                    break;
            }
        }
    }
}

export {Basic}