/**
 * DY
 */
import {dependencies} from "../Constants.js";
import Frustum from "../Primitive/Frustum.js";
import ObjectUtil from "../../despUtil/Util/ObjectUtil";
import Coordinate from "../Math/Coordinate";
import Check from "../../despUtil/Util/Check";

class BiasOptions {
    constructor(options) {
        this.type = options.type;
        this.polygonOffset = options.polygonOffset;
        this.polygonOffsetFactor = options.polygonOffsetFactor;
        this.polygonOffsetUnits = options.polygonOffsetUnits;
        this.normalOffset = options.normalOffset;
        this.normalOffsetScale = options.normalOffsetScale;
        this.normalShading = options.normalShading;
        this.normalShadingSmooth = options.normalShadingSmooth;
        this.depthBias = options.depthBias;
    }
}

const viewModel = {
    distance: 10000.0,
    darkness: 0.3,
    softShadows: true,
    debug: false,
    size: 2048,
    fitNearFar: true,
    freeze: false,
    biasModes: [
        new BiasOptions({
            type: 'terrain',
            polygonOffset: true,
            polygonOffsetFactor: 1.1,
            polygonOffsetUnits: 4.0,
            normalOffset: true,
            normalOffsetScale: 0.5,
            normalShading: true,
            normalShadingSmooth: 0.3,
            depthBias: 0.0001
        }),
        new BiasOptions({
            type: 'primitive',
            polygonOffset: true,
            polygonOffsetFactor: 1.1,
            polygonOffsetUnits: 4.0,
            normalOffset: true,
            normalOffsetScale: 0.1,
            normalShading: true,
            normalShadingSmooth: 0.05,
            depthBias: 0.00002
        }),
        new BiasOptions({
            type: 'point',
            polygonOffset: false,
            polygonOffsetFactor: 1.1,
            polygonOffsetUnits: 4.0,
            normalOffset: false,
            normalOffsetScale: 0.0,
            normalShading: true,
            normalShadingSmooth: 0.1,
            depthBias: 0.0005
        })
    ],
};


export default class Shadow {
    constructor(viewer, obj = {}) {
        if (!viewer) {
            throw new Error('viewer is required');
        }
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.camera = new dependencies.Cesium.Camera(this.scene);
        viewer.shadowMap.destroy();
        let option = {
            context: this.scene.context,
            lightCamera: this.camera,
            enabled: this.viewer.shadows,
            cascadesEnabled: false
        };
        this.videoDom = obj.videoDom;

        this.tmp_Texture = new dependencies.Cesium.Texture({
            context: this.viewer.scene.context,
            source: this.videoDom
        });

        let aimmer = () => {
            return this.tmp_Texture;
        };

        this.shadowMap = new dependencies.Cesium.ShadowMap(option);

        this.originFc = dependencies.Cesium.ShadowMap.createReceiveDerivedCommand;

        dependencies.Cesium.ShadowMap.createReceiveDerivedCommand = (lightShadowMaps, command, shadowsDirty, context, result) => {
            result = this.originFc.call(dependencies.Cesium.ShadowMap, lightShadowMaps, command, shadowsDirty, context, result);
            try {
                let shadowCommands = result;
                if (shadowCommands) {
                    if (shadowCommands.receiveCommand) {
                        shadowCommands.receiveCommand._uniformMap['tmp_Texture'] = aimmer;
                    }
                    let castCommands = shadowCommands.castCommands;
                    if (castCommands) {
                        for (let i = 0; i < castCommands.length; i++) {
                            let target = castCommands[i];
                            target._uniformMap['tmp_Texture'] = aimmer;
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
            return result;
        }

        viewer.scene.shadowMap = this.shadowMap;

        // this.shadowMap._primitiveRenderState
        try {
            let triger = this.shadowMap._passes[0].commandList.push;
            this.shadowMap._passes[0].commandList.push = (command) => {
                // if (command.derivedCommands) {
                //     let shadowCommands = command.derivedCommands.shadows;
                //     if (shadowCommands) {
                //         if (shadowCommands.receiveCommand) {
                //             shadowCommands.receiveCommand._uniformMap['tmp_texture'] = aimmer;
                //         }
                //         let castCommands = shadowCommands.castCommands;
                //         if (castCommands) {
                //             for (let i = 0; i < castCommands.length; i++) {
                //                 let target = castCommands[i];
                //                 target._uniformMap['tmp_texture'] = aimmer;
                //             }
                //         }
                //     }
                // }
                // command._uniformMap['tmp_texture'] = aimmer;
                this._updateCommand(command);
                command.dirty = true;
                triger.call(this.shadowMap._passes[0].commandList, command);
            }

            let origin = this.shadowMap.update;
            this.shadowMap.update = (frameState) => {
                // frameState.backgroundColor.alpha = 0.5;
                // frameState.invertClassificationColor.alpha = 0.5;
                if (this.tmp_Texture) {
                    this.tmp_Texture.destroy();
                    this.tmp_Texture = null;
                }
                this.tmp_Texture = new dependencies.Cesium.Texture({
                    context: this.viewer.scene.context,
                    source: this.videoDom
                });
                if (Check.function(this.position)) {
                    this.camera.position = Coordinate.handlePosition(this.position);
                }
                if (this.frustum) {
                    this.creatFrustum();
                }
                origin.call(this.shadowMap, frameState);
                // debugger
            }
        } catch (e) {
            console.log("shadowMap 更新失败。");
        }


        this.initSetting();

        this.setProperty(obj);

        if (obj.needOutline === true) {
            this.creatFrustum();
        }
    }

    _updateCommand(command) {
        if (!this.cache) {
            this.cache = command.vertexArray._context.shaderCache._shaders;
        }

        for (let name in this.cache) {
            if (this.cache.hasOwnProperty(name)) {
                if (name.startsWith('receiveShadow')) {
                    let sp = this.cache[name].shaderProgram;
                    if (!sp.__originnFS) {
                        let text = sp._fragmentShaderText;
                        sp.__originnFS = text;
                        let index = text.lastIndexOf("gl_FragColor.rgb *= visibility; \n} \n");
                        if (index !== -1) {
                            let tmpindex = text.indexOf("float czm_unpackDepth(vec4 packedDepth)");
                            let start = text.substr(0, tmpindex);
                            let end = text.substr(tmpindex);
                            text = start + `uniform sampler2D tmp_Texture;\n` + end;
                            index = text.lastIndexOf("gl_FragColor.rgb *= visibility; \n} \n");
                            text = text.substr(0, index);
                            text += `vec4 despColorVideo = texture2D(tmp_Texture,shadowPosition.xy); if (visibility == 1.) {gl_FragColor = despColorVideo; gl_FragColor.a = 0.5;} else {gl_FragColor = vec4(0.0,1.0,0.0,0.5);}}`;
                            sp._fragmentShaderText = text;
                            sp._gl.deleteProgram(sp._program);
                            sp._program = null;
                            sp.allUniforms;
                        }
                    }
                }
            }
        }
        try {
            // let castCommands = command.derivedCommands.shadows.castCommands;
            // let topState = command.renderState;
            command._renderState = dependencies.Cesium.RenderState.fromCache({
                'cull': {
                    'enabled': true
                },
                'depthTest': {
                    'enabled': true,
                    'func': 513
                },
                'blending': {
                    "enabled": true,
                    "equationRgb": 32774,
                    "equationAlpha": 32774,
                    "functionSourceRgb": 770,
                    "functionSourceAlpha": 770,
                    "functionDestinationRgb": 771,
                    "functionDestinationAlpha": 771
                }
            });
            // for (let i = 0; i < castCommands.length; i++) {
            //     let target = castCommands[i];
            //     target._renderState = dependencies.Cesium.RenderState.fromCache({
            //         'cull': {
            //             'enabled': false
            //         },
            //         'depthTest': {
            //             'enabled': true,
            //             'func': 513
            //         },
            //         'blending': {
            //             "enabled": true,
            //             "equationRgb": 32774,
            //             "equationAlpha": 32774,
            //             "functionSourceRgb": 770,
            //             "functionSourceAlpha": 770,
            //             "functionDestinationRgb": 771,
            //             "functionDestinationAlpha": 771
            //         }
            //     })
            //     target.dirty = true;
            //     // let renderState = target.renderState;
            //     // renderState = ObjectUtil.copy(renderState);
            //     // let blending = renderState.blending;
            //     // if (!blending) {
            //     //     renderState.blending = blending = {};
            //     // }
            //     // blending.enabled = topState.blending.enabled;
            //     // blending.equationAlpha = topState.blending.equationAlpha;
            //     // blending.functionDestinationRgb = topState.blending.functionDestinationRgb;
            //     // blending.functionDestinationAlpha = topState.blending.functionDestinationAlpha;
            //     // let colorMask = renderState.colorMask;
            //     // if (!colorMask) {
            //     //     colorMask = renderState.colorMask = {};
            //     // }
            //     // colorMask.red = topState.colorMask.red;
            //     // colorMask.green = topState.colorMask.green;
            //     // colorMask.blue = topState.colorMask.blue;
            //     // colorMask.alpha = topState.colorMask.alpha;
            //     //
            //     // renderState._applyFunctions = target.renderState._applyFunctions;
            //     //
            //     // target.renderState = renderState;
            //     // debugger
            // }
        } catch (e) {
            console.log(e);
        }

    }

    set fov(fov) {
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return;
        this.camera.frustum.fov = fov;

    }

    get fov() {
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return -1;
        return this.camera.frustum.fov;
    }

    set aspectRatio(aspectRatio) {
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return;
        this.camera.frustum.aspectRatio = aspectRatio;

    }

    get aspectRatio() {
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return -1;
        return this.camera.frustum.aspectRatio;
    }

    set heading(heading) {
        if (!Check.checkDefined(this.camera)) return;
        this.camera.setView({
            orientation: {
                heading: Coordinate.angleToRadian(heading),
                pitch: this.pitch,
                roll: this.roll
            }
        });

    }

    get heading() {
        if (!Check.checkDefined(this.camera)) return -1;
        return this.camera.heading;
    }

    set pitch(pitch) {
        if (!Check.checkDefined(this.camera)) return;
        this.camera.setView({
            orientation: {
                heading: this.heading,
                pitch: Coordinate.angleToRadian(pitch),
                roll: this.roll
            }
        });

    }

    get pitch() {
        if (!Check.checkDefined(this.camera)) return -1;
        return this.camera.pitch;
    }

    set roll(roll) {
        if (!Check.checkDefined(this.camera)) return;
        this.camera.setView({
            orientation: {
                heading: this.heading,
                pitch: this.pitch,
                roll: Coordinate.angleToRadian(roll)
            }
        });

    }

    get roll() {
        if (!Check.checkDefined(this.camera)) return -1;
        return this.camera.roll;
    }


    set far(far) {
        if (!Check.number(far)) far = 50000;
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return;
        if (far <= 1) {
            far = 2;
        }
        this.camera.frustum.far = far;
        this.shadowMap.maximumDistance = far;

    }

    get far() {
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return -1;
        return this.camera.frustum.far;
    }

    set near(near) {
        if (!Check.number(near)) near = 1;
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return;
        if (near >= this.far) {
            near = this.far - 1;
        }
        this.camera.frustum.near = near;

    }

    get near() {
        if (!Check.checkDefined(this.camera) || !Check.checkDefined(this.camera.frustum)) return -1;
        return this.camera.frustum.near;
    }


    /**
     *  统一的设置入口
     * @param {Object} obj - 传入的配置项
     */
    setProperty(obj) {
        ObjectUtil.setProperties(this, obj);
        this.far = Check.number(obj.far) ? obj.far : this.shadowMap.maximumDistance;
    }

    setCenter(center) {
        if (!Check.checkDefined(center)) return this;
        this.center = Coordinate.handlePosition(center);
        let range = dependencies.Cesium.Cartesian3.distance(this.camera.positionWC, this.center);
        this.camera.lookAt(this.center, new dependencies.Cesium.HeadingPitchRange(this.heading, this.pitch, range));

        return this;
    }

    setPosition(position) {
        if (!Check.checkDefined(position)) return this;
        this.position = position;

        if (this.center) {
            let tmpPosition = Coordinate.handlePosition(this.position);
            let range = dependencies.Cesium.Cartesian3.distance(tmpPosition, this.center);
            this.camera.lookAt(this.center, new dependencies.Cesium.HeadingPitchRange(this.heading, this.pitch, range));
        } else {
            this.camera.position = Coordinate.handlePosition(this.position);
        }

        return this;
    }

    creatFrustum() {
        if (this.frustum) {
            this.scene.primitives.remove(this.frustum);
        }
        this.frustum = new Frustum({
            near: this.near,
            far: this.far,
            camera: this.camera,
            position: this.camera.positionWC,
            direction: this.camera.directionWC,
            up: this.camera.upWC,
            right: this.camera.rightWC
        });
        this.frustum = this.scene.primitives.add(this.frustum.primitive_outline);
    }

    initSetting() {
        let shadowMap = this.shadowMap;

        shadowMap.maximumDistance = viewModel.distance;
        shadowMap._fitNearFar = viewModel.fitNearFar;
        shadowMap.darkness = viewModel.darkness;
        shadowMap.debugShow = viewModel.debug;
        shadowMap.debugFreezeFrame = viewModel.freeze;
        shadowMap.size = viewModel.size;
        shadowMap.softShadows = viewModel.softShadows;
        // this.viewer.shadows = true;
        // this.viewer.terrainShadows = 1;

        for (let i = 0; i < viewModel.biasModes.length; ++i) {
            let biasMode = viewModel.biasModes[i];
            let bias = shadowMap['_' + biasMode.type + 'Bias'];
            bias.polygonOffset = !shadowMap._isPointLight && shadowMap._polygonOffsetSupported && biasMode.polygonOffset;
            bias.polygonOffsetFactor = biasMode.polygonOffsetFactor;
            bias.polygonOffsetUnits = biasMode.polygonOffsetUnits;
            bias.normalOffset = biasMode.normalOffset;
            bias.normalOffsetScale = biasMode.normalOffsetScale;
            bias.normalShading = biasMode.normalShading;
            bias.normalShadingSmooth = biasMode.normalShadingSmooth;
            bias.depthBias = biasMode.depthBias;
        }

        shadowMap.debugCreateRenderStates();

        shadowMap.dirty = true;
    }

    destroy() {
        const defaultSetting = {
            context: this.viewer.scene.context,
            enabled: this.viewer.shadows,
            lightCamera: this.viewer.scene._shadowMapCamera
        };
        this.shadowMap.destroy();
        this.camera = null;
        if (this.cache) {
            for (let name in this.cache) {
                if (this.cache.hasOwnProperty(name)) {
                    if (name.startsWith('receiveShadow')) {
                        let sp = this.cache[name].shaderProgram;
                        if (sp.__originnFS) {
                            sp._fragmentShaderText = sp.__originnFS;
                            delete sp.__originnFS;
                            sp._gl.deleteProgram(sp._program);
                            sp._program = null;
                            sp.allUniforms;
                        }
                    }
                }
            }
            this.cache = null;
        }
        if (this.tmp_Texture) {
            this.tmp_Texture.destroy();
            this.tmp_Texture = null;
        }
        if (this.frustum) {
            this.scene.primitives.remove(this.frustum);
        }
        if (this.originFc) {
            dependencies.Cesium.ShadowMap.createReceiveDerivedCommand = this.originFc;
            this.originFc = null;
        }
        this.scene.shadowMap = new dependencies.Cesium.ShadowMap(defaultSetting);
        ObjectUtil.delete(this);
    }

}
