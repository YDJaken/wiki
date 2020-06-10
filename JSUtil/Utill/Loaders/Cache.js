/**
 * @Author DY
 */
/**
 * @class cache
 * @classdes 缓存类 用于记录已经加载过的资源的缓存索引，全局唯一
 */
class cache {
    constructor() {
        this.enabled = false;
        this.files = {};
    }

    /**
     * 添加一个缓存资源
     * @param key
     * @param file
     */
    add(key, file) {
        if (this.enabled === false) return;
        this.files[key] = file;
    }

    /**
     * 获取一个缓存资源
     * @param key
     * @return {*}
     */
    get(key) {
        if (this.enabled === false) return;
        return this.files[key];
    }

    /**
     * 删除一个缓存资源
     * @param key
     */
    remove(key) {
        delete this.files[key];
    }

    /**
     * 清空缓存
     */
    clear() {
        this.files = {};
    }
}

const Cache = new cache();
Cache.enabled = true;
export {Cache};