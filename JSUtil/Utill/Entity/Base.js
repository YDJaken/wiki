import ObjectUtil from "../ObjectUtil.js";
import Check from "../Check.js";

/**
 * @Author DY
 */

export default class Base {
    constructor(obj = {}, needInit = true) {
        this.context = obj.ctx;
        if (needInit === true) {
            this.setProperty(obj);
        }
    }

    /**
     *  统一的设置入口
     * @param {Object} obj - 传入的配置项
     */
    setProperty(obj) {
        ObjectUtil.setProperties(this, obj);
    }

    setX(x) {
        this.x = Check.number(x) ? x : 0;
        return this;
    }

    setY(y) {
        this.y = Check.number(y) ? y : 0;
        return this;
    }

    setWidth(width) {
        this.width = Check.number(width) ? width : 0;
        return this;
    }

    setHeight(height) {
        this.height = Check.number(height) ? height : 0;
        return this;
    }

    setColor(color) {
        this.color = Check.checkDefined(color) ? color : "black";
        return this;
    }

    interSect(x, y) {
        x = x - this.x;
        y = y - this.y;
        return x <= this.width && y <= this.height;
    }

    draw() {
        if (!this.context) return;
    }

    destroy() {
        ObjectUtil.delete(this);
    }
}
