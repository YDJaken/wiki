/**
 * 3D Tile 节点内容类
 * @Author DongYi
 */
import {Basic} from "./Basic.js";
import {Check} from "../Check/Check.js";
import {BoundingVolume} from "./BoundingVolume.js";

const uriObject = {};

class TileContent extends Basic {
    constructor(uri) {
        super();
        uri = Check.string(uri, 'TileContent:请输入uri。\'');
        if (Check.undefine(uri)) return;
        // 指向具体资源目录的uri
        this.uri = uri;
        // 包围形状 可从box,region,sphere中选一个
        this.boundingVolume = undefined;
    }

    /**
     * 将TileContent对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = `{"uri":"${this.uri}"`;
        let sup = super.toJSON();
        if (sup !== '') {
            ret += `,${sup}`;
        }
        if (!Check.undefine(this.boundingVolume)) {
            ret += `,"boundingVolume":${this.boundingVolume.toJSON()}`;
        }
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象变为TileContent对象
     * @param obj
     * @return {TileContent}
     */
    loadFromJSON(obj) {
        let uri;
        try {
            uri = obj.uri;
            if (uri === undefined) {
                uri = obj.url;
            }
        } catch (e) {
            console.warn('TileContent.loadFromJSON:传入对象缺失uri,请检查JSON结构');
            return;
        }
        super.loadFromJSON(obj);
        this.uri = uri;
        uriObject[obj.id] = uri;
        for (let prop in obj) {
            if (prop === 'boundingVolume') {
                this.boundingVolume = new BoundingVolume().loadFromJSON(obj.boundingVolume);
            }
        }
        return this;
    }
}

export {TileContent, uriObject}
