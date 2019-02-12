/**
 * 3D Tile 节点类
 * @Author DongYi
 */
import {Basic} from "./Basic.js";
import {Check} from "../Check/Check.js";
import {BoundingVolume} from "./BoundingVolume.js";
import {TileContent, uriObject} from "./TileContent.js";
import {Rectangle} from "../Math/Rectangle.js";
import {Coordinate} from "../Math/Coordinate.js";
import {EarthRadius} from "../src/Core/Constants.js";
import {TilesetSRC} from "./Tileset.js";
import {OBJModel} from "../Models/OBJModel.js";
import {GLTFModel} from "../Models/GLTFModel.js";
import {B3DMModel} from "../Models/B3DMModel.js";
import {STLModel} from "../Models/STLModel.js";

const defaultTransform = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1];

class Tile extends Basic {
    constructor(geometricError, transform) {
        super();
        geometricError = Check.number(geometricError, 'Tile:请输入geometicError。');
        if (Check.undefine(geometricError)) return;
        this.uuid = '';
        // 可以接受的米级别的渲染误差. 运行时通过此值计算屏幕渲染差.
        this.geometricError = geometricError;
        // 包围形状 可从box,region,sphere中选一个
        this.boundingVolume = undefined;
        // 可视形状 可从box,region,sphere中选一个
        this.viewerRequestVolume = undefined;
        // 当更换级别时使用addtive 或者 replace 从父节点继承
        this.refine = '';
        // 一个浮点值4X4的矩阵用于做不同轴之间的转换 默认值[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
        this.transform = transform || defaultTransform;
        // 用于存储此节点内的对应内容的元数据和URI
        this.content = undefined;
        // 存储此节点的子节点
        this.children = [];
        // 存储此节点的父节点
        this.parent = undefined;
    }

    /**
     * 根据uuid确定对应的瓦片
     * @param uuid
     * @param root
     * @return {*|Node|Element}
     * @private
     */
    static _loadByUUID(uuid, root) {
        let a = uuid.split('丨');
        let currentNode = root;
        for (let i = 1; i < a.length; i++) {
            currentNode = currentNode.children[a[i]];
        }
        return currentNode;
    }

    /**
     * 私有方法
     * @param uri
     * @param level
     * @param name
     * @private
     */
    _loadModel(uri, level, name) {
        let format = uri.substring(uri.lastIndexOf('.') + 1);
        let position;
        let height;
        let rec;
        if (this.boundingVolume.region === undefined) {
            console.log(`Speed3D尚未支持除了包围长方形之外的包围物模式。`);
            return;
        } else {
            rec = Rectangle.fromRadians(this.boundingVolume.region[0], this.boundingVolume.region[1], this.boundingVolume.region[2], this.boundingVolume.region[3]);
            position = Rectangle.southeast(rec);
            height = Rectangle.computeWidth(rec);
        }
        position = {
            position: [Coordinate.radianToAngle(position.longitude), Coordinate.radianToAngle(position.latitude), position.height],
            scale: 1,
            rotation: [0, 0, 0]
        };
        let a;
        format = format.toLocaleLowerCase();
        switch (format) {
            case 'gltf':
            case 'bgltf':
            case 'glb':
                a = new GLTFModel(TilesetSRC.pathPerfix + uri, position);
                break;
            case 'obj':
                a = new OBJModel(TilesetSRC.pathPerfix + uri, position);
                break;
            case 'b3dm':
                a = new B3DMModel(TilesetSRC.pathPerfix + uri, position);
                break;
            case 'stl':
                position.position[0] -= Coordinate.radianToAngle(height);
                position.rotation = [1.3, 3.15, 0.35];
                // position.scale = 7;
                a = new STLModel(TilesetSRC.pathPerfix + uri, position);
                break;
            default:
                console.log(`Speed3D尚未支持${format}格式,请联系开发者或者在工程包中自主实现。${uri}`);
                return;
        }
        a.load(name);
        level.push(this.uuid);
    }

    /**
     * 对比一个数是否在范围内
     * @param compare 需要对比的数
     * @param target 对比目标
     * @param range 范围
     * @return {boolean}
     */
    static lessInRange(compare, target, range) {
        return (compare - range) <= target;
    }

    /**
     * 计算当前视角和模型包围物之间的差值
     * @param position
     * @private
     */
    _computGeometricError(position) {
        /**
         * 包围盒 尚未实现
         */
        if (this.boundingVolume.box !== undefined) {
            return;
        }
        /**
         * 包围长方形
         */
        if (this.boundingVolume.region !== undefined) {
            let rec = Rectangle.fromRadians(this.boundingVolume.region[0], this.boundingVolume.region[1], this.boundingVolume.region[2], this.boundingVolume.region[3]);
            let min = this.boundingVolume.region[4];
            let max = this.boundingVolume.region[5];
            let array = [];
            Tile.computeDistance(position, Rectangle.southwest(rec), max, min, array);
            Tile.computeDistance(position, Rectangle.southeast(rec), max, min, array);
            Tile.computeDistance(position, Rectangle.northwest(rec), max, min, array);
            Tile.computeDistance(position, Rectangle.northeast(rec), max, min, array);
            Tile.computeDistance(position, Rectangle.center(rec), max, min, array);
            return Math.min(...array) / 50.0;
        }

        /**
         * 包围球 尚未实现
         */
        if (this.boundingVolume.sphere !== undefined) {
            return;
        }
    }

    /**
     * 计算三维坐标系内两个点的距离 |AB| = sqrt((x1-x2)^2+(y1-y2)^2+(z1-z2)^2)
     * @param position
     * @param input
     * @param max
     * @param min
     * @param array
     */
    static computeDistance(position, input, max, min, array) {
        let location = Coordinate.sphericalToCartesian(Coordinate.radianToAngle(input.longitude), Coordinate.radianToAngle(input.latitude), EarthRadius + min);
        array.push(Math.sqrt((position.x - location.x) * (position.x - location.x) + (position.y - location.y) * (position.y - location.y) + (position.z - location.z) * (position.z - location.z)));
        location = Coordinate.sphericalToCartesian(Coordinate.radianToAngle(input.longitude), Coordinate.radianToAngle(input.latitude), EarthRadius + max);
        array.push(Math.sqrt((position.x - location.x) * (position.x - location.x) + (position.y - location.y) * (position.y - location.y) + (position.z - location.z) * (position.z - location.z)));
    }

    /**
     * 将Tile对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = `{"geometricError":${this.geometricError}`;
        if (this.transform !== defaultTransform) {
            ret += `,"transform":[${this.transform}]`;
        }
        let sup = super.toJSON();
        if (sup !== '') {
            ret += `,${sup}`;
        }
        if (!Check.undefine(this.boundingVolume)) {
            ret += `,"boundingVolume":${this.boundingVolume.toJSON()}`;
        }
        if (!Check.undefine(this.viewerRequestVolume)) {
            ret += `,"viewerRequestVolume":${this.viewerRequestVolume.toJSON()}`;
        }
        if (!Check.undefine(this.content)) {
            ret += `,"content":${this.content.toJSON()}`;
        }
        if (this.refine !== '') {
            ret += `,"refine":"${this.refine}"`;
        }
        if (this.children.length > 0) {
            ret += `,"children":[`;
            let arry = [];
            for (let i = 0; i < this.children.length; i++) {
                arry.push(this.children[i].toJSON());
            }
            ret += arry.join(',');
            ret += ']';
        }
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象转换为children
     * @param obj
     * @param {Tile} parent
     */
    loadChildren(obj, parent = undefined) {
        let children = [];
        for (let i = 0; i < obj.length; i++) {
            children.push(new Tile(0).loadFromJSON(obj[i], parent, i));
        }
        this.children = children;
    }

    /**
     * 将传入的JSON对象变为Tile对象
     * @param obj
     * @param {Tile} parent
     * @param index
     * @return {Tile}
     */
    loadFromJSON(obj, parent = undefined, index = 0) {
        let geometricError;
        try {
            geometricError = obj.geometricError;
        } catch (e) {
            console.warn('Tile.loadFromJSON:传入对象缺失geometricError,请检查JSON结构');
            return;
        }
        super.loadFromJSON(obj);
        try {
            if (obj.transform) {
                this.transform = obj.transform;
            }
        } catch (e) {
            this.transform = defaultTransform;
        }
        this.geometricError = geometricError;
        if (parent !== undefined) {
            this.parent = parent.uuid;
            this.uuid = parent.uuid + '丨' + index;
        } else {
            this.uuid = '-1';
        }
        if (obj.refine === undefined) {
            this.refine = parent.refine;
        }
        for (let prop in obj) {
            switch (prop) {
                case 'boundingVolume':
                    this.boundingVolume = new BoundingVolume().loadFromJSON(obj.boundingVolume);
                    break;
                case 'viewerRequestVolume':
                    this.viewerRequestVolume = new BoundingVolume().loadFromJSON(obj.viewerRequestVolume);
                    break;
                case 'refine':
                    this.refine = obj.refine;
                    break;
                case 'content':
                    obj.content.id = this.uuid;
                    this.content = new TileContent('').loadFromJSON(obj.content);
                    break;
                case 'children':
                    if (Array.isArray(obj.children)) {
                        this.loadChildren(obj.children, this);
                    } else {
                        if (!Check.undefine(obj.children)) {
                            this.children.push(new Tile(0).loadFromJSON(obj.children, this));
                        }
                    }
                    break;
            }
        }
        return this;
    }
}

export {Tile}