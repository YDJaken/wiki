/**
 * B3DM模型抽象类
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {FileLoader} from "../Loaders/FileLoader.js";
import {Coordinate} from "../Math/Coordinate.js";
import B3dm from "../Loaders/B3dmLoader.js"
import {EarthRadius, ModelLayerRenderOrder} from "../src/Core/Constants.js";
import {Color} from "../src/Datum/Math/Color.js";
import {Model} from "./Model.js";
import {Mesh} from "../src/Geometry/Mesh.js";
import {MeshStandardMaterial} from "../Materials/MeshStandardMaterial.js";
import {Geometry} from "../src/Core/Geometry.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Face3} from "../src/Core/Face3.js";
import {BufferGeometry} from "../src/Core/BufferGeometry.js";

/**
 * 默认配置
 */
const DefaultSetting_B3DM = {
    onload: undefined,
    onProgress: undefined,
    onError: function (error) {
        console.log(error);
    },
    modifyColor: false,
    gltfUpAxis: 'Y',
    urlBase: './'/*,
    doNotPatchMaterial: 'false',
    opacity: 1.0,
    overrideMaterials: 'false'*/
};

class B3DMModel extends Model {
    /**
     *构造函数
     * @param src 文件目录
     * @param obj 传入的配置项
     */
    constructor(src, obj) {
        super(src, obj);
        obj = Check.checkInput(this.property, DefaultSetting_B3DM);
        this.property = obj;
    }

    /**
     * B3Dm加载流程
     */
    load(name) {
        super.loder(name);
        if (this.loadObject || this.isDestoried) return;
        let loader = new FileLoader();
        loader.setResponseType('arraybuffer');
        let that = this;
        if (this.property.onload === undefined) {
            if (this.property.position.length > 3 || this.property.position.length < 2 || this.property.position.length === undefined) {
                console.info('Speed3D.GLTFModel:请输入有效的模型的经纬度和高度');
                return;
            }
            if (this.property.position.length === 2) {
                this.property.position.push(0);
            }
            this.property.onload = function (data) {
                B3dm.parse(data, that.property).then(values => {
                    if (values.batchTable.BIN !== undefined) {
                        // cesium 版
                        B3DMModel._loadSingleModel(values.batchTable, values.gltf, that);
                    } else {
                        // fanfan 版
                        B3DMModel._loadSingleModelF(values.batchTable, values.gltf, that);
                    }
                    that.addToLayer(name);
                });
            }
        }
        loader.load(that.src, that.property.onload, that.property.onProgress, that.property.onError);
    }

    // fanfan 版
    static _loadSingleModelF(batchTable, gltf, B3DM) {
        let position = Coordinate.sphericalToCartesian(B3DM.property.position[0], B3DM.property.position[1], EarthRadius + B3DM.property.position[2]);
        let a = gltf.scene.children;
        let ids = [];
        for (let i = 0; i < a.length; i++) {
            let b = a[i];
            b.renderOrder = ModelLayerRenderOrder;
            //处理位置
            b.position.set(position.x, position.y, position.z);
            //处理旋转
            if (B3DM.property.rotation.length === 1 || B3DM.property.rotation.length === undefined) {
                b.rotation.setScalar(B3DM.property.rotation);
            } else {
                b.rotation.set(B3DM.property.rotation[0], B3DM.property.rotation[1], B3DM.property.rotation[2]);
            }
            //处理缩放
            if (B3DM.property.scale.length === 1 || B3DM.property.scale.length === undefined) {
                b.scale.setScalar(B3DM.property.scale);
            } else {
                b.scale.set(B3DM.property.scale[0], B3DM.property.scale[1], B3DM.property.scale[2]);
            }
            let material = b.material;
            if (material.length === undefined) {
                //处理颜色
                material.color = new Color(B3DM.property.color);
                //处理灯光
                material.lights = B3DM.property.light;
            } else {
                for (let ma in material) {
                    material[ma].color = new Color(B3DM.property.color);
                    material[ma].lights = B3DM.property.light;
                }
            }
            for (let asd in batchTable) {
                switch (asd) {
                    case 'TerrainHeight':
                    case 'height':
                    case 'latitude':
                    case 'longitude':
                        break;
                    default:
                        if (B3DM.exters[asd] === undefined) B3DM.exters[asd] = [];
                        B3DM.exters[asd].push(batchTable[asd][i]);
                        break;
                }
            }
            ids.push(b.id);
            B3DM.group.add(b);
            i--;
        }
        B3DM.loadObject = ids;
    }

    // cesium 版
    static _loadSingleModel(batchTable, gltf, B3DM) {
        if (batchTable.BIN.length > 1) {
            let batchIDIndex = [];
            let a = gltf.scene.children[0];
            let b = a.geometry.attributes._BATCHID.array.subarray(0);
            let startIndex = [];
            let endIndex = [];
            let totalLength = b.length;
            for (let n = 0; n < totalLength; n++) {
                let c = Math.round(b[n]);
                if (batchIDIndex.indexOf(c) === -1) {
                    batchIDIndex.push(c);
                    startIndex.push(n);
                    if (startIndex.length > 1) {
                        endIndex.push(n - 1);
                    }
                }
            }
            endIndex.push(totalLength);
            let c = B3DMModel._fromBufferGeometry(a.geometry, batchIDIndex, startIndex, endIndex, batchTable, gltf);
            let group = B3DM.group;
            let ids = [];
            let corE = new Coordinate().Ellipsoid;
            let positionCe = new Vector3();
            positionCe.fromArray(gltf.parser.extensions.CESIUM_RTC.center);
            positionCe.y = -positionCe.y;
            positionCe = corE.cartesianToCartographic(positionCe.x, positionCe.y, positionCe.z);
            positionCe = Coordinate.sphericalToCartesian(positionCe.longitude, positionCe.latitude, EarthRadius/*+5000*/);
            for (let i = 0; i < c.length; i++) {
                let ma = new MeshStandardMaterial();
                try {
                    ma.copy(a.material);
                } catch (e) {
                    ma.copy(a.material[0]);
                }

                let mesh = new Mesh(c[i], ma);
                mesh.renderOrder = ModelLayerRenderOrder;
                let position = positionCe;
                //处理位置
                mesh.position.set(position.x, position.y, position.z);
                //处理旋转
                if (B3DM.property.rotation.length === 1 || B3DM.property.rotation.length === undefined) {
                    mesh.rotation.setScalar(B3DM.property.rotation);
                } else {
                    mesh.rotation.set(B3DM.property.rotation[0], B3DM.property.rotation[1], B3DM.property.rotation[2]);
                }
                //处理缩放
                if (B3DM.property.scale.length === 1 || B3DM.property.scale.length === undefined) {
                    mesh.scale.setScalar(B3DM.property.scale);
                } else {
                    mesh.scale.set(B3DM.property.scale[0], B3DM.property.scale[1], B3DM.property.scale[2]);
                }
                let material = mesh.material;
                if (material.length === undefined) {
                    //处理颜色
                    if (B3DM.property.modifyColor) material.color = new Color(B3DM.property.color);
                    //处理灯光
                    material.lights = B3DM.property.light;
                } else {
                    for (let j = 0; j < material.length; j++) {
                        if (B3DM.property.modifyColor) material[j].color = new Color(B3DM.property.color);
                        if (material[j].lights) material[j].lights = B3DM.property.light;
                    }
                }
                //处理其他属性
                for (let asd in batchTable) {
                    switch (asd) {
                        case 'TerrainHeight':
                        case 'height':
                        case 'latitude':
                        case 'longitude':
                            break;
                        default:
                            if (B3DM.exters[asd] === undefined) B3DM.exters[asd] = [];
                            B3DM.exters[asd].push(batchTable[asd][batchIDIndex[i]]);
                            break;
                    }
                }
                ids.push(mesh.id);
                group.add(mesh);
            }
            B3DM.loadObject = ids;
        } else {
            let ids = [];
            let a = gltf.scene.children;
            let position = Coordinate.sphericalToCartesian(batchTable.longitude[0], batchTable.latitude[0], EarthRadius + batchTable.TerrainHeight[0]);
            for (let i = 0; i < a.length; i++) {
                let b = a[i];
                //处理位置
                b.position.set(position.x, position.y, position.z);
                b.renderOrder = ModelLayerRenderOrder;
                //处理旋转
                if (B3DM.property.rotation.length === 1 || B3DM.property.rotation.length === undefined) {
                    b.rotation.setScalar(B3DM.property.rotation);
                } else {
                    b.rotation.set(B3DM.property.rotation[0], B3DM.property.rotation[1], B3DM.property.rotation[2]);
                }
                //处理缩放
                if (B3DM.property.scale.length === 1 || B3DM.property.scale.length === undefined) {
                    b.scale.setScalar(B3DM.property.scale);
                } else {
                    b.scale.set(B3DM.property.scale[0], B3DM.property.scale[1], B3DM.property.scale[2]);
                }
                let material = b.material;
                if (material.length === undefined) {
                    //处理颜色
                    if (B3DM.property.modifyColor) material.color = new Color(B3DM.property.color);
                    //处理灯光
                    material.lights = B3DM.property.light;
                } else {
                    for (let j = 0; j < material.length; j++) {
                        if (B3DM.property.modifyColor) material[j].color = new Color(B3DM.property.color);
                        if (material[j].lights) material[j].lights = B3DM.property.light;
                    }
                }
                for (let asd in batchTable) {
                    switch (asd) {
                        case 'TerrainHeight':
                        case 'height':
                        case 'latitude':
                        case 'longitude':
                            break;
                        default:
                            if (B3DM.exters[asd] === undefined) B3DM.exters[asd] = [];
                            B3DM.exters[asd].push(batchTable[asd][i]);
                            break;
                    }
                }
                ids.push(b.id);
                B3DM.group.add(b);
                i--;
            }
            B3DM.loadObject = ids;
        }
    }

    static _findIndex(startIndex, endIndex, index) {
        for (let i = 0; i < startIndex.length; i++) {
            if (B3DMModel._inRange(startIndex[i], endIndex[i], index)) {
                return i;
            }
        }
        return -1;
    }

    static _inRange(min, max, input) {
        return input <= max && input >= min;
    }

    static _fromBufferGeometry(geometry, batchIDIndex, startIndex, endIndex, a, b) {
        let inputG = new Array(batchIDIndex.length);
        let indices = geometry.index !== null ? geometry.index.array : undefined;
        let attributes = geometry.attributes;
        let positions = attributes.position.array;
        let normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
        let tempNormals = [];
        let tempVertices = [];
        for (let i = 0; i < positions.length; i += 3) {
            tempVertices.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
            if (normals !== undefined) {
                tempNormals.push(new Vector3(normals[i], normals[i + 1], normals[i + 2]));
            }
        }
        for (let i = 0; i < inputG.length; i++) {
            let a = new Geometry();
            a.vertices = tempVertices;
            inputG[i] = a;
        }

        function addFace(a, b, c, materialIndex = 0, inputGs) {
            let vertexNormals = normals !== undefined ? [tempNormals[a].clone(), tempNormals[b].clone(), tempNormals[c].clone()] : [];
            let face = new Face3(a, b, c, vertexNormals, [], materialIndex);
            inputGs.faces.push(face);
        }

        for (let i = 0; i < indices.length; i += 3) {
            let max = Math.max(indices[i], indices[i + 1], indices[i + 2]);
            let min = Math.min(indices[i], indices[i + 1], indices[i + 2]);
            let indexx1 = B3DMModel._findIndex(startIndex, endIndex, max);
            let indexx2 = B3DMModel._findIndex(startIndex, endIndex, min);
            if (indexx2 !== indexx1) {
                addFace(indices[i], indices[i + 1], indices[i + 2], 0, inputG[indexx1]);
                addFace(indices[i], indices[i + 1], indices[i + 2], 0, inputG[indexx2]);
            } else {
                addFace(indices[i], indices[i + 1], indices[i + 2], 0, inputG[indexx1]);
            }
        }
        for (let i = 0; i < inputG.length; i++) {
            inputG[i].computeFaceNormals();
            let a = new BufferGeometry();
            inputG[i] = a.fromGeometry(inputG[i]);
        }
        return inputG;
    }
}

export {B3DMModel}