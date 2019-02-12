/**
 * 3D Tileset
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {Basic} from "./Basic.js";
import {Asset} from "./Asset.js";
import {Properties} from "./Property.js";
import {Tile} from "./Tile.js";

const TilesetSRC = {};
class Tileset extends Basic {
    constructor(geometricError, pathPerfix = '') {
        super();
        geometricError = Check.number(geometricError, 'TilesetBasic:请输入geometicError。');
        if (Check.undefine(geometricError)) return;
        // 可以接受的米级别的渲染误差. 运行时通过此值计算屏幕渲染差.
        this.geometricError = geometricError;
        // 全部瓦片的元数据.
        this.asset = undefined;
        // 基础特性集合.
        this.properties = undefined;
        // 此瓦片集的根节点
        this.root = undefined;
        // 在此瓦片集内用的拓展属性的名字列表
        this.extensionsUsed = '';
        // 此瓦片集需要的拓展的名字列表
        this.extensionsRequired = '';
        // 此瓦片集的路径前缀
        TilesetSRC.pathPerfix = pathPerfix;
    }

    /**
     * 将Tileset对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = `{"geometricError":${this.geometricError}`;
        let sup = super.toJSON();
        if (sup !== '') {
            ret += `,${sup}`;
        }
        if (!Check.undefine(this.asset)) {
            ret += `,"asset":${this.asset.toJSON()}`;
        }
        if (!Check.undefine(this.properties)) {
            ret += `,"properties":${this.properties.toJSON()}`;
        }
        if (!Check.undefine(this.root)) {
            ret += `,"root":${this.root.toJSON()}`;
        }
        if (this.extensionsUsed !== '') {
            ret += `,"extensionsUsed":"${this.extensionsUsed}"`;
        }
        if (this.extensionsRequired !== '') {
            ret += `,"extensionsRequired":"${this.extensionsRequired}"`;
        }
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象变为Tileset对象
     * @param obj
     * @return {Tileset}
     */
    loadFromJSON(obj) {
        let geometricError;
        try {
            geometricError = obj.geometricError;
        } catch (e) {
            console.warn('Tileset.loadFromJSON:传入对象缺失geometricError,请检查JSON结构');
            return;
        }
        super.loadFromJSON(obj);
        this.geometricError = geometricError;
        for (let prop in obj) {
            switch (prop) {
                case 'extensionsRequired':
                    this.extensionsRequired = obj.extensionsRequired;
                    break;
                case 'extensionsUsed':
                    this.extensionsUsed = obj.extensionsUsed;
                    break;
                case 'asset':
                    this.asset = new Asset('').loadFromJSON(obj.asset);
                    break;
                case 'properties':
                    this.properties = new Properties().loadFromJSON(obj.properties);
                    break;
                case 'root':
                    this.root = new Tile(0).loadFromJSON(obj.root);
                    break;
            }
        }
        return this;
    }
}

export {Tileset,TilesetSRC}