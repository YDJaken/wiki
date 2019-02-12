/**
 * Tiles加载基础类
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {Tileset} from "./Tileset.js";

class TileLoader {
    /**
     * 加载3D Tiles 函数
     * @param json
     * @param srcPrefix
     * @param result 用于支持其他符合规范的格式 只要实现loadFromJSON(json)
     */
    static load(json, srcPrefix = './', result = undefined) {
        json = Check.object(json, 'TileLoader.load:请传入一个合规的json对象');
        if (Check.undefine(json)) return;
        srcPrefix = Check.string(srcPrefix, 'TileLoader.load:请传入一个合规的地址前缀');
        if (Check.undefine(srcPrefix)) return;
        if (Check.undefine(result)) {
            result = new Tileset(json.geometricError, srcPrefix).loadFromJSON(json);
        } else {
            result = result.loadFromJSON(json);
        }
        return result;

    }

    /**
     * 将Tileset转换为JSON
     * @param input 传入的TileSet对象 必须实现toJSON
     */
    static parse(input) {
        if (Check.undefine(input)) {
            console.log('TileLoader.parse:缺少传入的TileSet对象');
            return;
        }
        return input.toJSON();
    }

}

export {TileLoader}