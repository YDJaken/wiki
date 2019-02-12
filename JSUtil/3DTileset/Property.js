/**
 * 3D Tiles基础数据类 - Property
 * @Author DongYi
 */
import {Basic} from "./Basic.js";
import {Check} from "../Check/Check.js";

class Property extends Basic {
    constructor(maximum, minimum) {
        super();
        maximum = Check.number(maximum, 'Properties:请输入maximum。');
        if (Check.undefine(maximum)) return;
        minimum = Check.number(minimum, 'Properties:请输入minimum。');
        if (Check.undefine(minimum)) return;
        // 在瓦片集中此属性的最大值
        this.maximum = maximum;
        // 在瓦片集中此属性的最小值
        this.minimum = minimum;
        this.isProperty = true;
    }

    /**
     * 将Property对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = `{"maximum":${this.maximum},"minimum":${this.minimum}`;
        let sup = super.toJSON();
        if (sup !== '') {
            ret += `,${sup}`;
        }
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象变为Property对象
     * @param obj
     * @return {Property}
     */
    loadFromJSON(obj) {
        super.loadFromJSON(obj);
        return this;
    }
}

/**
 * 3D Tiles基础数据类 - Properties
 * @Author DongYi
 */
class Properties {
    constructor() {
        this.properties = {};
    }

    /**
     * 添加 property
     * @param property
     */
    addProperty(property, name) {
        if (!property.isProperty) {
            console.log('Properties:addProperty传入参数不是支持的property');
            return;
        }
        this.properties[name] = property;
    }

    /**
     * 检查属性是否在全局要求的范围内
     * @param propertyString
     * @param Value
     */
    checkBetween(propertyString,Value){
        return this.properties[propertyString].maximum >= Value && this.properties[propertyString].minimum <= Value
    }

    /**
     * 将Properties对象转化为JSON字符串
     * @return {string}
     */
    toJSON() {
        let ret = '{';
        let arry = [];
        for (let name in this.properties) {
            arry.push(`"${name}":${this.properties[name].toJSON()}`);
        }
        ret += arry.join(',');
        ret += '}';
        return ret;
    }

    /**
     * 将传入的JSON对象变为Properties对象
     * @param obj
     * @return {Properties}
     */
    loadFromJSON(obj) {
        obj = Check.object(obj, 'Properties.loadFromJSON:传入obj不合规');
        if (Check.undefine(obj)) return;
        for (let name in obj) {
            let set = obj[name];
            let max, min;
            try {
                max = set.maximum;
                min = set.minimum;
            } catch (e) {
                console.warn('Property.loadFromJSON:传入对象缺失maximum或minimum,请检查JSON结构');
                return;
            }
            let pro = new Property(max, min).loadFromJSON(set);
            this.addProperty(pro, name);
        }
        return this;
    }
}

export {Properties}