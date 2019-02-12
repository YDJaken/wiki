/**
 * 模型图层类
 * @Author DongYi
 */
import {Check} from "../Check/Check.js";
import {Group_Modified} from "./Group_Modified.js";
import {ModelLayerRenderOrder} from "../src/Core/Constants.js";

class modelLayer {

    constructor() {
        this.ModelLayer = new Group_Modified();
        this.ModelLayer.renderOrder = ModelLayerRenderOrder - 1;
        this.children = this.ModelLayer.children;
        this.scene = null;
        this.added = false;
        this.processors = {};
    }

    /**
     * 添加一个3D瓦片操作类
     * @param processor
     */
    addProcessor(processor) {
        if (processor.loadMode === 'add') {
            let group = new Group_Modified();
            this.add(group);
            this.processors[processor.name] = {
                group: group,
                processor: processor
            };
        } else if (processor.loadMode === 'replace') {
            console.log('尚未实现。');
        }
    }

    /**
     * 根据名称加载Processor
     * @param name
     * @return {*}
     */
    loadProcessorByName(name) {
        if (Check.undefine(name)) return;
        return this.processors[name].processor;
    }

    /**
     * 根据名称加载Processor的内部模型
     * @param name
     */
    loadProcessorGroupByName(name) {
        if (Check.undefine(name)) return;
        return this.processors[name].group;
    }

    /**
     * 删除一个3D瓦片操作类
     * @param name
     */
    removeProcessor(name) {
        if (Check.undefine(name)) return;
        this.remove(this.loadProcessorGroupByName(name));
        let processor = this.loadProcessorByName(name);
        this.processors[name] = null;
        return processor;
    }

    /**
     * 添加一个模型对象到图层
     * @param obj
     */
    add(obj) {
        obj = Check.object(obj);
        if (obj === undefined) return;
        this.ModelLayer.add(obj);
    }

    /**
     * 添加一串模型对象到图层
     * @param objs
     */
    addAll(objs) {
        if (!Array.isArray(objs)) return;
        for (let i = 0; i < objs.length; i++) {
            this.add(objs[i]);
        }
    }

    /**
     * 删除图层的一个模型对象
     * @param obj
     */
    remove(obj) {
        obj = Check.object(obj);
        if (obj === undefined) return;
        this.ModelLayer.remove(obj);
    }

    /**
     * 删除图层的一串模型对象
     * @param objs
     */
    removeAll(objs) {
        if (!Array.isArray(objs)) return;
        for (let i = 0; i < objs.length; i++) {
            this.remove(objs[i]);
        }
    }

    /**
     * 添加视窗
     * @param scene
     */
    addScene(scene) {
        if (this.added === true) return;
        this.scene = scene;
        scene.add(this.ModelLayer);
        this.added = true;
    }

    /**
     * 彻底删除图层
     */
    destory() {
        while (this.processors.length > 0) {
            let a = this.removeProcessor(this.processors.length - 1);
            a.destory();
        }
        this.processors = [];
        this.scene.remove(this.ModelLayer);
        for (let i = 0; i < this.children.length; i++) {
            this.ModelLayer.remove(this.children[i]);
            i--;
        }
        this.ModelLayer = null;
        this.layerID = null;
        this.children = null;
        this.scene = null;
        this.added = null;
    }
}

const ModelLayer = new modelLayer();
export {ModelLayer};