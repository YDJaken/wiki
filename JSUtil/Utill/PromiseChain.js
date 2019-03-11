/**
 * @Author DY
 */
import ArrayUtil from "./ArrayUtil.js";
import Check from "./Check.js";

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

    setResolve(resolve) {
        if (Check.function(resolve)) {
            this.resolve = resolve;
        }
    }

    setReject(reject) {
        if (Check.function(reject)) {
            this.reject = reject;
        }
    }

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
}
