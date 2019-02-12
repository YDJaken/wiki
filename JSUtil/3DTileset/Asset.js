/**
 * 3D Tiles基础数据类 - Asset
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {Basic} from "./Basic.js";

class Asset extends Basic {
    constructor(version) {
        super();
        version = Check.string(version, 'Asset:请输入version。');
        if (Check.undefine(version)) return;
        // 当前3D瓦片总版本
        this.version = version;
        // 此3D瓦片的版本号,用于追踪此瓦片是否更新
        this.tilesetVersion = undefined;
    }

    /**
     * 将Asset对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = `{"version":"${this.version}"`;
        let sup = super.toJSON();
        if (sup !== '') {
            ret += `,${sup}`;
        }
        if (!Check.undefine(this.tilesetVersion)) {
            ret += `,"tilesetVersion":"${this.tilesetVersion}"`
        }
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象变为Asset对象
     * @param obj
     * @return {Asset}
     */
    loadFromJSON(obj) {
        let version;
        try {
            version = obj.version;
        } catch (e) {
            console.warn('Asset.loadFromJSON:传入对象缺失version,请检查JSON结构');
            return;
        }
        super.loadFromJSON(obj);
        for (let prop in obj) {
            if (prop === 'tilesetVersion') {
                this.tilesetVersion = obj.tilesetVersion;
            }
        }
        this.version = version;
        return this;
    }
}

export {Asset}