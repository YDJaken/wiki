/**
 * 模型抽象基类
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {Coordinate} from "../Math/Coordinate.js";
import {EarthRadius, ModelLayerRenderOrder} from "../src/Core/Constants.js";
import {Color} from "../src/Datum/Math/Color.js";
import {Matrix4} from "../src/Datum/Math/Matrix4.js";
import {ModelLayer} from "./ModelLayer.js";
import {Group_Modified} from "./Group_Modified.js";


/**
 * 默认配置
 * @type {{scale: number, color: string, rotation: number[], position: Array, light: boolean, onload: undefined, onProgress: undefined, onError: undefined}}
 */
const DefaultSetting = {
    scale: 100,
    gap: 0,
    color: 'white',
    rotation: [-Math.PI / 4, 0, 0],
    position: [110, 20, 0],
    light: true//暂未实现
};

class Model {
    /**
     *构造函数
     * @param src 文件目录
     * @param obj 传入的配置项
     */
    constructor(src, obj = DefaultSetting) {
        if (!window.top.Speed3D.scene) {
            console.warn(`Speed3D.scene未创建!`);
            return;
        }
        src = Check.string(src, 'Speed3D.Model:请输入有效的文件目录');
        if (Check.undefine(src)) return;
        obj = Check.object(obj, 'Speed3D.Model:请输入有效的属性对象');
        if (Check.undefine(obj)) return;
        if (obj !== DefaultSetting) obj = Check.checkInput(obj, DefaultSetting);
        this.layer = ModelLayer;
        if (ModelLayer.added === false) ModelLayer.addScene(window.top.Speed3D.scene);
        this.property = obj;
        this.src = src;
        this.loadObject = undefined;
        this.isDestoried = false;
        this.group = new Group_Modified();
        this.group.renderOrder = ModelLayerRenderOrder;
        this.exters = {};
    }

    static findModelClass(obj) {
        return obj.parent.hostClass;
    }

    loder(name) {
        this.group.hostClass = this;
    }

    addToLayer(name) {
        if (!name) {
            this.layer.add(this.group);
        } else {
            this.layer.processors[name].group.add(this.group);
        }
    }

    getObjectById(id) {
        return this.group.children[this.getIndexById(id)];
    }

    getIndexById(id) {
        return id - this.group.children[0].id;
    }

    /**
     * 应用旋转矩阵
     * @param transform
     * @param index
     */
    applyMatrix(transform, index = 0) {
        if (!this.loadObject) {
            return;
        }
        let target = this.loadObject[index];
        let matrix4 = new Matrix4().fromArray(transform);
        this.getObjectById(target).applyMatrix(matrix4);
    }

    /**
     * 将某一模型移到某一位置
     * @param lon 经度
     * @param lat 纬度
     * @param height 高度
     * @param index 对应索引
     */
    move(lon, lat, height = 0, index = 0) {
        if (!this.loadObject) {
            return;
        }
        let target = this.loadObject[index];
        let position = Coordinate.sphericalToCartesian(lon, lat, EarthRadius + height);
        this.getObjectById(target).position.set(position.x, position.y, position.z);
    }


    /**
     * 将全部模型移到某一位置
     * @param lon 经度
     * @param lat 纬度
     * @param height 高度
     */
    moveAll(lon, lat, height = 0) {
        if (!this.loadObject) {
            return;
        }
        let position = Coordinate.sphericalToCartesian(lon, lat, EarthRadius + height);
        for (let target = 0; target < this.loadObject.length; target++) {
            if (target !== 0 && this.property.gap !== 0) {
                position = Coordinate.sphericalToCartesian(lon + this.property.gap, lat + this.property.gap, EarthRadius + height);
            }
            this.getObjectById(this.loadObject[target]).position.set(position.x, position.y, position.z);
        }
    }


    /**
     * 将某一模型旋转
     * @param x 沿x轴旋转
     * @param y 沿y轴旋转
     * @param z 沿z轴旋转
     * @param index 对应索引
     */
    rotation(x = 0, y = 0, z = 0, index = 0) {
        if (!this.loadObject) {
            return;
        }
        let target = this.loadObject[index];
        this.getObjectById(target).rotation.set(x, y, z);
    }

    /**
     * 设置某一模型的颜色
     * @param colorString
     * @param index
     */
    setColor(colorString, index = 0) {
        if (!this.loadObject) {
            return;
        }
        let target = this.loadObject[index];
        let material = this.getObjectById(target).material;
        if (material.length === undefined) {
            material.color = new Color(colorString);
        } else {
            for (let i = 0; i < material.length; i++) {
                material[i].color = new Color(colorString);
            }
        }
    }

    /**
     * 设置全部模型的颜色
     * @param colorString
     */
    setColorAll(colorString) {
        if (!this.loadObject) {
            return;
        }
        for (let index in this.loadObject) {
            let target = this.loadObject[index];
            let material = this.getObjectById(target).material;
            if (material.length === undefined) {
                material.color = new Color(colorString);
            } else {
                for (let i = 0; i < material.length; i++) {
                    material[i].color = new Color(colorString);
                }
            }
        }
    }

    /**
     * 设置某一模型的缩放
     * @param scale
     * @param index
     */
    setScale(scale, index = 0) {
        if (!this.loadObject) {
            return;
        }
        let target = this.loadObject[index];
        if (Array.isArray(scale)) {
            this.getObjectById(target).scale.set(scale[0], scale[1], scale[2]);
        } else if (scale.isVector3) {
            this.getObjectById(target).scale.set(scale.x, scale.y, scale.z);
        } else {
            this.getObjectById(target).scale.setScalar(scale);
        }
    }

    /**
     * 设置全部模型的缩放
     * @param scale
     */
    setScaleAll(scale) {
        if (!this.loadObject) {
            return;
        }
        for (let index in this.loadObject) {
            let target = this.loadObject[index];
            if (Array.isArray(scale)) {
                this.getObjectById(target).scale.set(scale[0], scale[1], scale[2]);
            } else if (scale.isVector3) {
                this.getObjectById(target).scale.set(scale.x, scale.y, scale.z);
            } else {
                this.getObjectById(target).scale.setScalar(scale);
            }
        }
    }

    /**
     * 删除某一模型
     * @param index
     */
    delete(index = 0) {
        if (!this.loadObject) {
            return;
        }
        if (this.loadObject.length === 0) {
            this.loadObject = null;
            return;
        }
        let target = this.loadObject[index];
        this.group.remove(this.getObjectById(target));
        this.loadObject.splice(index, 1);
        if (this.loadObject.length === 0) {
            this.loadObject = null;
        }
    }

    /**
     * 删除所有模型
     */
    deleteAll() {
        if (!this.loadObject) {
            return;
        }
        for (let target in this.loadObject) {
            this.group.remove(this.getObjectById(this.loadObject[target]));
        }
        this.loadObject = null;
    }

    /**
     * 彻底清除此对象释放内存
     */
    destory() {
        if (this.loadObject) {
            this.deleteAll();
        }
        this.group = null;
        this.layer = null;
        this.isDestoried = true;
        this.src = null;
        this.property = null;
        this.exters = null;
    }
}

export {Model}