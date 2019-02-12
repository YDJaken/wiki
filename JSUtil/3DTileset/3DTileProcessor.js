/**
 * 3D Tile 处理
 * @Author DongYi
 */
import {Tileset} from "./Tileset.js";
import {uriObject} from "./TileContent.js";
import {Tile} from "./Tile.js";

var DefaulteName_Count = 0;

class TileProcessor {
    constructor(tileSet, name) {
        if (!tileSet instanceof Tileset) return;
        if (!name) {
            name = "DefaulteName" + DefaulteName_Count;
            DefaulteName_Count++;
        }
        this.name = name;
        this.tileSet = tileSet;
        this.camera = window.top.Speed3D.camera;
        this.saveADDObject = [];
        this.svaeReObject;
        this.loadMode = 'add';
    }

    active(position = undefined) {
        const {camera} = this;
        if (position === undefined) {
            position = camera.position;
        }
        let refine = this.tileSet.root.refine;
        if (refine.toLocaleLowerCase() === 'add') {
            this.findShowingNodeADD(position, this.saveADDObject, this.name);
        } else if (refine.toLocaleLowerCase() === 'replace') {
            this.loadMode = 'replace';
            this.findShowingNodeADD(position, this.saveADDObject, this.name);
            // this.findShowingNodeReplace(position, this.saveADDObject);
        }
    }

    /**
     * 在refine为ADD的情况下 只会向下级节点查询,上级返回parent 或者 root 字符串
     * @param position
     * @param level
     * @param name
     */
    findShowingNodeADD(position, level, name) {
        // if (this.saveADDObject.index.length > 3) return;
        if (!Tile.lessInRange(this.tileSet.root._computGeometricError(position), this.tileSet.root.geometricError, 10)) return;

        for (let ass in uriObject) {
            if (level.indexOf(ass) === -1) {
                // if (ass !== "-1丨0丨1丨1丨3丨0") continue;
                // if (this.saveADDObject.index.length > 3) break;
                let tile = this._loadByUUID(ass);
                let geometricError = tile._computGeometricError(position);
                if (!Tile.lessInRange(geometricError, tile.geometricError, 10)) {
                    continue;
                }
                let uri = tile.content === undefined ? undefined : tile.content.uri;
                if (uri !== undefined) tile._loadModel(uri, level, name);
            }
        }
    }

    /**
     *  在refine为replace的情况下 (待实现)
     * @param position
     * @param level
     * @param name
     */
    findShowingNodeReplace(position, level, name) {
        console.log('暂未实现');
        return;
    }

    /**
     * 根据uuid确定对应的瓦片
     * @param uuid
     * @return {*|Node|Element}
     * @private
     */
    _loadByUUID(uuid) {
        return Tile._loadByUUID(uuid, this.tileSet.root);
    }

    /*
    * 根据模型的index设定模型颜色
    * @param index,color
    * */
    setColor(index, color) {
        let uuid = this.saveADDObject.index[index];
        let loadcontex = this.saveADDObject.loadedModel[uuid].loadContex;
        if (loadcontex !== null) {
            this.saveADDObject.loadedModel[uuid].setColor(color);
        } else {
            console.log("model  is not loaded");
        }
    }

    /*
     * 根据模型的index设定模型比例尺
     * @param index,scale
     * */
    setScale(index, scale) {
        let uuid = this.saveADDObject.index[index];
        let loadcontex = this.saveADDObject.loadedModel[uuid].loadContex;
        if (loadcontex !== null) {
            this.saveADDObject.loadedModel[uuid].setScale(scale);
        } else {
            console.log("model  is not loaded");
        }
    }

    /*
     * 根据模型的index设定模型的旋转
     * @param index,x,y,z
     * */
    rotation(index, x = 0, y = 0, z = 0) {
        let uuid = this.saveADDObject.index[index];
        let loadcontex = this.saveADDObject.loadedModel[uuid].loadContex;
        if (loadcontex !== null) {
            this.saveADDObject.loadedModel[uuid].rotation(x, y, z);
        } else {
            console.log("model  is not loaded");
        }
    }


    destory() {

    }
}

export {TileProcessor}