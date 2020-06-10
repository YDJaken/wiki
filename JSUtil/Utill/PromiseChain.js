/**
 * @Author DY
 */
import ArrayUtil from "./ArrayUtil.js";
import Check from "./Check.js";
import ObjectUtil from "./ObjectUtil.js";
import {getTimestamp} from "../Constants.js"

/**
 * @class PromiseChain
 * @classdesc 创建PromiseChain
 * @param promises
 * @param resolve
 * @param reject
 */
export default class PromiseChain {

    constructor(promises, resolve, reject) {
        this.promises = [];
        this.reject = () => {
            console.log(`default reject,请添加失败回调。`);
        };
        this.resolve = () => {
            console.log(`default resolve,请添加成功回调。`);
        };
        this.add(promises);
        this.setResolve(resolve);
        this.setReject(reject);
    }

    /**
     * 开始执行异步
     * @param arg
     */
    all(...arg) {
        if (this.promises.length === 0) {
            this.resolve(...arg);
        } else {
            let current = new Promise(this.promises.shift());
            current.then((...args) => {
                this.all(...args);
            }).catch((...args) => {
                while (this.promises.length > 0) {
                    this.promises.shift();
                }
                this.reject(...args);
            });
        }
    }

    /**
     * 开始执行一段限定时间的异步
     * @param time
     * @param timeFunction
     * @param promises
     * @param arg
     */
    allTimed(time, timeFunction, promises = this.promises, viewer, ...arg) {
        if (promises.length === 0) {
            this.resolve(...arg);
        } else {
            if (promises.length > 1) {
                this.reject("allTimed:现只支持一个时间操作函数");
                return;
            }
            let timeGap = 0;
            time -= timeGap;
            return new Promise((resolve, reject) => {
                this.startTime = getTimestamp();
                let fun = promises[0];
                let callBack = undefined;
                let startRepeat = () => {
                    let now = getTimestamp();
                    let timePass = now - this.startTime;
                    timePass = timePass / time;
                    if (timePass >= 0.9999999) {
                        timeFunction(1, ...arg);
                        if (Check.checkDefined(callBack)) {
                            callBack();
                            callBack = undefined;
                        }
                        resolve(...arg);
                        return;
                    }
                    let target = new Promise(fun);
                    target.then((...args) => {
                        timeFunction(timePass, ...args);
                        if (Check.checkDefined(viewer)) {
                            if (!Check.checkDefined(callBack)) {
                                callBack = viewer.clock.onTick.addEventListener(startRepeat);
                            }
                        } else {
                            setTimeout(() => {
                                startRepeat();
                            }, timeGap);
                        }
                    }).catch((...args) => {
                        if (Check.checkDefined(callBack)) {
                            callBack();
                            callBack = undefined;
                        }
                        this.reject(...args);
                    });
                };
                startRepeat();
            });
        }
    }

    /**
     * 设置成功回调
     * @param resolve
     */
    setResolve(resolve) {
        if (Check.function(resolve)) {
            this.resolve = resolve;
        }
    }

    /**
     * 设置失败回调
     * @param reject
     */
    setReject(reject) {
        if (Check.function(reject)) {
            this.reject = reject;
        }
    }

    /**
     * 添加一个新的异步函数
     * @param promises
     */
    add(promises) {
        if (promises) {
            if (Check.Array(promises)) {
                for (let i = 0; i < promises.length; i++) {
                    if (Check.function(promises[i]))
                        this.promises.push(promises[i]);
                }
            } else {
                if (Check.function(promises))
                    this.promises.push(promises);
            }
        }
    }

    /**
     * 删除某一个异步函数
     * @param index
     */
    remove(index) {
        if (Check.function(index)) {
            let tmp = index.toString();
            for (let i = 0; i < this.promises.length; i++) {
                if (this.promises[i].toString() === tmp) {
                    ArrayUtil.removeIndex(i, this.promises);
                    break;
                }
            }
        } else {
            ArrayUtil.removeIndex(index, this.promises);
        }
    }

    destroy() {
        ObjectUtil.delete(this);
    }
}
