/**
 * @Author DY
 */
import Base from "./Base.js"
import ObjectUtil from "../ObjectUtil";
import Check from "../Check";
import {Epsilon08} from "../../Constants.js";

export default class Line extends Base {
    constructor(obj = {}, needInit = true) {
        super(obj, false);
        if (needInit === true) {
            this.setProperty(obj);
        }
    }

    interSect(x, y) {
        let slope = this.width / this.height;
        let slope2 = (x - this.x) / (y - this.y);
        return Check.inRange(slope - Epsilon08, slope + Epsilon08, slope2);
    }

    /**
     *  统一的设置入口
     * @param {Object} obj - 传入的配置项
     */
    setProperty(obj) {
        ObjectUtil.setProperties(ObjectUtil.getSuperClass(this), obj, this);
        ObjectUtil.setProperties(this, obj);
    }

    setLineWidth(lineWidth) {
        this.lineWidth = Check.number(lineWidth) ? lineWidth : 3.0;
        return this;
    }

    draw() {
        if (!this.context) return;
        this.context.beginPath();
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.color;
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + this.width, this.y + this.height);
        this.context.closePath();
        this.context.stroke();
    }
}
