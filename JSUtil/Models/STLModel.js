/**
 * STL模型抽象类
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {Coordinate} from "../Math/Coordinate.js";
import {EarthRadius, ModelLayerRenderOrder} from "../src/Core/Constants.js";
import {Color} from "../src/Datum/Math/Color.js";
import {Model} from "./Model.js";
import {STLLoader} from "../Loaders/STLLoader.js";
import {Mesh} from "../src/Geometry/Mesh.js";
import {MeshPhongMaterial} from "../src/Materials/MeshPhongMaterial.js";

/**
 * 默认配置
 * 如果设置了onload,则需要以上的scale,color等均不生效。
 * @type {{scale: number, color: string, rotation: number[], position: Array, light: boolean, onload: undefined, onProgress: undefined, onError: undefined}}
 */
const DefaultSetting_STL = {
    onload: undefined,
    onProgress: undefined,
    onError: function (error) {
        console.log(error);
    }
};

class STLModel extends Model {
    /**
     *构造函数
     * @param src 文件目录
     * @param obj 传入的配置项
     */
    constructor(src, obj) {
        super(src, obj);
        obj = Check.checkInput(this.property, DefaultSetting_STL);
        this.property = obj;
    }

    /**
     * STL加载流程
     */
    load(name) {
        super.loder(name);
        if (this.loadObject || this.isDestoried) return;
        let loader = new STLLoader();
        let that = this;
        if (this.property.onload === undefined) {
            if (this.property.position.length > 3 || this.property.position.length < 2 || this.property.position.length === undefined) {
                console.info('Speed3D.GLTFModel:请输入有效的模型的经纬度和高度');
                return;
            }
            if (this.property.position.length === 2) {
                this.property.position.push(0);
            }
            this.property.onload = function (obj) {
                let position = Coordinate.sphericalToCartesian(that.property.position[0], that.property.position[1], EarthRadius + that.property.position[2]);
                let ma = new MeshPhongMaterial();
                let b = new Mesh(obj, ma);
                b.renderOrder = ModelLayerRenderOrder;

                let ids = [];
                //处理位置
                b.position.set(position.x, position.y, position.z);
                //处理旋转
                if (that.property.rotation.length === 1 || that.property.rotation.length === undefined) {
                    b.rotation.setScalar(that.property.rotation);
                } else {
                    b.rotation.set(that.property.rotation[0], that.property.rotation[1], that.property.rotation[2]);
                }
                //处理缩放
                if (that.property.scale.length === 1 || that.property.scale.length === undefined) {
                    b.scale.setScalar(that.property.scale);
                } else {
                    b.scale.set(that.property.scale[0], that.property.scale[1], that.property.scale[2]);
                }
                let material = b.material;
                if (material.length === undefined) {
                    //处理颜色
                    material.color = new Color(that.property.color);
                    //处理灯光
                    material.lights = that.property.light;
                } else {
                    for (let ma in material) {
                        material[ma].color = new Color(that.property.color);
                        material[ma].lights = that.property.light;
                    }
                }
                ids.push(b.id);
                that.group.add(b);
                that.loadObject = ids;
                that.addToLayer(name);
            }
        }
        loader.load(that.src, that.property.onload, that.property.onProgress, that.property.onError);
    }
}

export {STLModel}