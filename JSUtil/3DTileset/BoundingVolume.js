/**
 * 3D Tiles基础数据类 - BoundingVolume
 * @Author DongYi
 */
import {Basic} from "./Basic.js";
import {Check} from "../Check/Check.js";

class BoundingVolume extends Basic {
    constructor() {
        super();
        /**
         * 一个长度为12的数组用于规定包围盒的形状(尚未实现)
         * 前三个数字代表包围盒中心的x,y,z值
         * 之后三个数字定义x轴的方向和半长
         * 之后三个数字定义y轴的方向和半宽
         * 最后三个数字定义z轴的方向和半高
         * @type {Array}
         */
        this.box = undefined;
        /**
         * 一个长度为6的数组用于规定包围区域的长方形(计划实现)
         * 数组内为根据WGS84 椭球体传入以下值 west, south, east, north的意义参照${Rectangle}内的west, south, east, north定义
         * [west, south, east, north, minimum height, maximum height]
         * 经纬度使用弧度制,高度使用米为单位
         * @type {Array}
         */
        this.region = undefined;
        /**
         * 一个长度为4的数组用于定义包围球的形状(尚未实现)
         * 前三个数字代表圆心的x.y.z值,最后一个数字代表圆的半径
         * @type {Array}
         */
        this.sphere = undefined;
    }

    /**
     * 将BoundingVolume对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = '{';
        if (!Check.undefine(this.box)) {
            ret += `"box":[${this.box.join(',')}]`
        }
        if (!Check.undefine(this.region)) {
            ret += `"region":[${this.region.join(',')}]`
        }
        if (!Check.undefine(this.sphere)) {
            ret += `"sphere":[${this.sphere.join(',')}]`
        }
        let sup = super.toJSON();
        if (sup !== '') {
            ret += `,${sup}`;
        }
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象变为BoundingVolume对象
     * @param obj
     * @return {BoundingVolume}
     */
    loadFromJSON(obj) {
        super.loadFromJSON(obj);
        for (let name in obj) {
            switch (name) {
                case 'box':
                    this.box = obj.box;
                    break;
                case 'region':
                    this.region = obj.region;
                    break;
                case 'sphere':
                    this.sphere = obj.sphere;
                    break;
            }
        }
        return this;
    }

}

export {BoundingVolume}