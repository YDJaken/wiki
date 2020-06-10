import Base from "./Base";
import Check from "../Check";
import {Epsilon08} from "../../Constants";
import ObjectUtil from "../ObjectUtil";

/**
 * @Author DY
 */
export default class Rectangle extends Base {
    constructor(obj = {}, needInit = true) {
        super(obj, false);
        if (needInit === true) {
            this.setProperty(obj);
        }
    }

    /**
     *  统一的设置入口
     * @param {Object} obj - 传入的配置项
     */
    setProperty(obj) {
        ObjectUtil.setProperties(ObjectUtil.getSuperClass(this), obj, this);
        ObjectUtil.setProperties(this, obj);
    }

    draw() {
        if (!this.context) return;
        this.context.fillStyle = this.color;
        this.context.globalAlpha = Math.random();
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.fill();
        this.context.globalAlpha = 1.0;
    }
}
