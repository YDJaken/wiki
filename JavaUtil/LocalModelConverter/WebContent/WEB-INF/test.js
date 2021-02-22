// http://localhost:8079/LocalModelConverter/StartJob?type=obj&inputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55%5CA55.obj&outputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55_TEST&srsString=39.90691,116.39123&textureFormat=webp&minZoom=16&maxZoom=20&threadCount=2&recon=false&dracoCompression=true&mergeRepeat=true&nolight=true&doubleside=false&lod=true&textureproj=false&simplify=true
// http://localhost:8079/LocalModelConverter/EndJob?type=obj&inputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55%5CA55.obj&outputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55_TEST&srsString=39.90691,116.39123&textureFormat=webp&minZoom=16&maxZoom=20&threadCount=2&recon=false&dracoCompression=true&mergeRepeat=true&nolight=true&doubleside=false&lod=true&textureproj=false&simplify=true
// "E:\server.exe " 8787 "E:\lab2.lic"
// 8787 "E:\eclipse-workspace\LocalModelConverter\WebContent\WEB-INF\lab2.lic"
class ArrayUtil {

    static findIndex(array, fun, aim = undefined) {
        if (!Check.function(fun)) {
            return -1;
        }
        if (!Check.Array(array)) {
            return -1;
        }
        let ret = -1;
        for (let i = 0; i < array.length; i++) {
            if (fun.call(aim, array[i], i)) {
                return i;
            }
        }
        return ret;
    }

    static findIndexLast(array, fun, aim = undefined) {
        if (!Check.function(fun)) {
            return -1;
        }
        if (!Check.Array(array)) {
            return -1;
        }
        let ret = -1;
        for (let i = array.length - 1; i >= 0; i--) {
            if (fun.call(aim, array[i], i)) {
                return i;
            }
        }
        return ret;
    }


    static computeAvg(array, min) {
        let len = array.length;
        if (len === 0) return 0;
        if (!min) {
            min = Infinity;
            for (let i = 0; i < len; i++) {
                min = Math.min(array[i], min);
            }
        }

        let sum = 0;
        for (let i = 0; i < len; i++) {
            sum = sum + (array[i] - min);
        }

        return (min + sum / len) / 1000.0;
    }

    /**
     * 检测数组内是否存在目标项
     * @param array
     * @param target
     * @returns {Number}
     */
    static contains(array, target) {
        return array.indexOf(target);
    }

    /**
     * 删除某一位置
     * @param index
     * @param array
     * @return {*} 被删除的元素
     */
    static removeIndex(index, array) {
        if (index === -1 || index >= array.length) {
            return undefined;
        }
        if (index === 0) {
            return array.shift();
        }
        if (index === array.length - 1) {
            return array.pop();
        }
        return array.splice(index, 1)[0];
    }

    /**
     * 添加某一位置
     * @param index
     * @param array
     * @param item
     */
    static addIndex(index, array, item) {
        if (index === 0) {
            return array.unshift(item);
        }
        if (index === array.length) {
            return array.push(item);
        }
        return array.splice(index, 0, item);
    }

    /**
     * 从某一位置开始向数组添加另一数组
     * @param index
     * @param array
     * @param inputarray
     * @return {*}
     */
    static addArray(index, array, inputarray) {
        for (let i = 0; i < inputarray.length; i++) {
            ArrayUtil.addIndex(index++, array, inputarray[i]);
        }
        return array;
    }

    /**
     * 删除Array内的indexArray
     * @param {Array} indexArray
     * @param array
     * @param offset
     */
    static removeSome(indexarray, array, offset = 0) {
        indexarray = indexarray.sort();
        let count = 0;
        for (let i = 0; i < indexarray.length; i++) {
            ArrayUtil.removeIndex(Math.max(indexarray[i] - count + offset, 0), array);
            count++;
        }
        return array;
    }

    /**
     * 交换数组中的两个元素的位置
     * @param index
     * @param target
     * @param array
     */
    static swap(index, target, array) {
        if (index === target) return array;
        if (index < 0 || target < 0) return array;
        let length = array.length;
        if (index >= length || target >= length) return array;
        let tmp = array[index];
        array[index] = array[target];
        array[target] = tmp;
        return array;
    }
}

class Check {
    /**
     * 检查传入参数是否已经定义
     * @param input
     * @returns {Boolean}
     */
    static checkDefined(input) {
        return input !== undefined && input !== null;
    }


    static defaultValue(input, value) {
        if (Check.checkDefined(input)) {
            return input
        } else {
            return value;
        }
    }

    /**
     * 检查传入参数是否为String 类型
     * @param input
     * @returns {Boolean}
     */
    static string(input) {
        return Check.checkDefined(input) && (typeof input === 'string' || input instanceof String);
    }

    /**
     * 检查传入参数是否为number 类型
     * @param input
     * @returns {Boolean}
     */
    static number(input) {
        return Check.checkDefined(input) && (typeof input === 'number' || input instanceof Number) && !Number.isNaN(input);
    }

    /**
     * 检查传入参数是否为function 类型
     * @param input
     * @returns {Boolean}
     */
    static function(input) {
        return Check.checkDefined(input) && (typeof (input) === 'function' || (input instanceof Function));
    }

    /**
     * 检查入参是否为Array
     * @param input
     * @returns {Boolean}
     */
    static Array(input) {
        return Check.checkDefined(input) && Array.isArray(input);
    }

    /**
     * 判断在范围内
     * @param min
     * @param max
     * @param input
     * @return {Boolean}
     */
    static inRange(min, max, input) {
        return input <= max && input >= min;
    }

    /**
     * 检查入参是否为Object
     * @param input
     * @returns {Boolean}
     */
    static Object(input) {
        return Check.checkDefined(input) && (typeof (input) === 'object' || (input instanceof Object));
    }
}

class ObjectUtil {

    /**
     * 获取目标的父类方法
     * @param target
     * @param time
     * @return {string[]}
     */
    static getSuperClass(target, time = 0) {
        let tmp = Object.getPrototypeOf(target);
        while (time > 0) {
            tmp = Object.getPrototypeOf(tmp);
            time--;
        }
        let targetOwn = Object.getOwnPropertyNames(tmp);
        tmp = tmp.__proto__;
        tmp = Object.getOwnPropertyNames(tmp);
        for (let i = 0; i < tmp.length; i++) {
            if (targetOwn.indexOf(tmp[i]) !== -1) {
                ArrayUtil.removeIndex(i--, tmp);
            }
        }
        return tmp;
    }

    /**
     * 根据规则设定属性
     * @param target
     * @param obj
     * @param source
     */
    static setProperties(target, obj, source) {
        let boolean = Check.Array(target);
        let temp = boolean ? target : Object.getOwnPropertyNames(Object.getPrototypeOf(target));
        for (let i = 0; i < temp.length; i++) {
            let name = temp[i];
            if (name === "setShow" || name === "setProperty" || name === "setAttr") continue;
            let index = name.indexOf("set");
            if (index === 0) {
                let tmp = name.slice(3);
                tmp = tmp.charAt(0).toLocaleLowerCase() + tmp.slice(1);
                if (Check.checkDefined(obj[tmp]) || (!boolean && !Check.checkDefined(target[tmp]) || (boolean && !Check.checkDefined(source[tmp])))) {
                    if (boolean === true) {
                        if (!Check.checkDefined(source[tmp]) || source[tmp] !== obj[tmp])
                            source[name](obj[tmp]);
                    } else {
                        target[name](obj[tmp]);
                    }
                }
            }
        }
        if (Check.checkDefined(target.setShow)) {
            target.setShow(obj.show !== false);
        }

    }

    /**
     * 合并对象
     * @param target
     * @param source
     * @return {any}
     */
    static merge(target, source) {
        let ret = Object.assign({}, target);
        for (let name in source) {
            if (source.hasOwnProperty(name)) {
                if (!Check.checkDefined(ret[name])) {
                    ret[name] = source[name];
                }
            }
        }
        return ret;
    }

    /**
     * 复制对象
     * @param object
     */
    static copy(object) {
        if (Check.Array(object)) {
            let ret = [];
            for (let i = 0; i < object.length; i++) {
                ret.push(ObjectUtil.copy(object[i]));
            }
            return ret;
        } else if (Check.Object(object)) {
            let ret = {};
            for (let name in object) {
                if (name === "collection") continue;
                if (object.hasOwnProperty(name)) {
                    if (Check.Array(object[name])) {
                        let tmpA = [];
                        for (let i = 0; i < object[name].length; i++) {
                            tmpA.push(ObjectUtil.copy(object[name][i]));
                        }
                        ret[name] = tmpA;
                    } else if (!Check.Object(object[name])) {
                        ret[name] = object[name];
                    } else {
                        ret[name] = ObjectUtil.copy(object[name]);
                    }
                }
            }
            return ret;
        }
        return object;
    }


    /**
     * 浅层删除
     * @param object
     */
    static delete(object) {
        if (!Check.checkDefined(object)) return;
        for (let name in object) {
            if (!object.hasOwnProperty(name)) continue;
            if (Check.Array(object[name])) {
                while (object[name].length > 0) {
                    let a = object[name].pop();
                    if (Check.Object(a)) {
                        if (a.destroy) {
                            try {
                                a.destroy();
                            } catch (e) {
                                ObjectUtil.delete(a);
                            }
                        } else {
                            ObjectUtil.delete(a);
                        }
                    } else {
                        a = null;
                    }
                }
            }
            object[name] = null;
            delete object[name];
        }
    }

    /**
     * 递归删除
     * @param object
     */
    static deleteComplete(object) {
        for (let name in object) {
            if (!object.hasOwnProperty(name)) continue;

            if (Check.Object(object[name])) {
                ObjectUtil.deleteComplete(object[name]);
            } else if (Check.Array(object[name])) {
                while (object[name].length > 0) {
                    ObjectUtil.deleteComplete(object[name].pop());
                }
            }
            try {
                object[name] = null;
                delete object[name];
            } catch (e) {
                return;
            }

        }
    }
}

class xhrManager {
    constructor(obj) {
        this.setProperty(obj);
        this.init();
    }

    init() {
        this.xhrs = [];
        for (let i = 0; i < this.netNumber; i++) {
            this.xhrs.push(new XMLHttpRequest());
        }
        this.queryList = [];
    }

    _loadActiveNet() {
        for (let i = 0; i < this.netNumber; i++) {
            if (this.xhrs[i].readyState === XMLHttpRequest.UNSENT) {
                return this.xhrs[i];
            }
        }
        return undefined;
    }

    /**
     *  统一的设置入口
     * @param {Object} obj - 传入的配置项
     */
    setProperty(obj) {
        ObjectUtil.setProperties(this, obj);
    }

    setNetNumber(netNumber) {
        this.netNumber = Check.number(netNumber) ? netNumber : 5;
        return this;
    }

    _resetNet(target) {
        target.abort();
    }

    _startQuery(option, target, resolve, reject) {
        target.open(option.method, option.url);
        if (Check.checkDefined(option.header)) {
            for (let header in option.header) {
                if (option.header.hasOwnProperty(header)) {
                    target.setRequestHeader(header, option.header[header]);
                }
            }
        }
        if (Check.number(option.timeout)) {
            target.timeout = option.timeout;
        } else {
            target.timeout = 0;
        }
        if (option.method === "POST") {
            target.send(option.data);
        } else {
            target.send();
        }
        target.ontimeout = (data) => {
            reject(data);
            new Promise((resolve1) => {
                this._resetNet(target);
                this._processQuery();
                resolve1();
            })
        }
        target.onerror = (data) => {
            reject(data);
            new Promise((resolve1) => {
                this._resetNet(target);
                this._processQuery();
                resolve1();
            })
        }
        target.onload = (data) => {
            resolve({
                response: target.response,
                responseText: target.responseText,
                responseType: target.responseType,
                responseURL: target.responseURL,
                responseXML: target.responseXML,
                status: target.status,
                statusText: target.statusText
            });
            new Promise((resolve1) => {
                this._resetNet(target);
                this._processQuery();
                resolve1();
            })
        }
    }

    _processQuery(options) {
        if (Check.checkDefined(options)) {
            this.queryList.push(options);
        }
        let target = this._loadActiveNet();
        let promise = undefined;
        if (!Check.checkDefined(target)) {
            if (Check.checkDefined(options)) {
                promise = new Promise((resolve, reject) => {
                    options.promise = (target, option) => {
                        if (!Check.checkDefined(target)) {
                            reject(undefined, "cancel");
                        } else {
                            this._startQuery(option, target, resolve, reject);
                        }
                    }
                });
            }
        } else {
            let option = this.queryList.shift();
            if (!Check.checkDefined(option)) {
                return promise;
            }
            if (Check.function(option.promise)) {
                option.promise(target, option);
            } else {
                promise = new Promise((resolve, reject) => {
                    this._startQuery(option, target, resolve, reject);
                });
            }
        }
        return promise;
    }

    get(url, options = {}) {
        options.url = url;
        options.method = "GET";
        return this._processQuery(options);
    }

    post(url, data, options = {}) {
        if (!Check.checkDefined(data)) {
            throw new Error("data is needed");
        }
        options.url = url;
        options.method = "POST";
        options.data = data;
        return this._processQuery(options);
    }


    cancelAll() {
        for (let i = 0; i < this.netNumber; i++) {
            if (this.xhrs[i].readyState !== XMLHttpRequest.UNSENT) {
                this.xhrs[i].abort();
            }
        }
        for (let i = 0; i < this.queryList; i++) {
            if (Check.checkDefined(this.queryList[i].promise)) {
                this.queryList[i].promise();
            }
        }
    }

    destroy() {
        this.cancelAll();
        ObjectUtil.delete(this);
    }
}

var manager = new xhrManager({netNumber: 20});

function testStart() {
    for (let i = 0; i < 20; i++) {
        manager.get("http://localhost:8079/LocalModelConverter/StartJob?type=obj&inputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55%5CA55.obj&outputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55_TEST&srsString=39.90691,116.39123&textureFormat=webp&minZoom=16&maxZoom=20&threadCount=2&recon=false&dracoCompression=true&mergeRepeat=true&nolight=true&doubleside=false&lod=true&textureproj=false&simplify=true").then((data) => {
            console.log(data)
        }, (error) => {
            console.log(error)
        })
    }
}

function testEnd() {
    manager.get("http://localhost:8079/LocalModelConverter/EndJob?type=obj&inputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55%5CA55.obj&outputPath=Q%3A%5Cusr%5Clocal%5ConlineServer%5Cres%5CA55_TEST%5CA55_TEST&srsString=39.90691,116.39123&textureFormat=webp&minZoom=16&maxZoom=20&threadCount=2&recon=false&dracoCompression=true&mergeRepeat=true&nolight=true&doubleside=false&lod=true&textureproj=false&simplify=true").then((data) => {
        console.log(data)
    }, (error) => {
        console.log(error)
    })
}
