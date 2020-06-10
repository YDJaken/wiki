/**
 * @Author DY
 */
/**
 * @class LoadingManager
 * @classdes 资源管理器 用于管理加载器
 * @param onLoad
 * @param onProgress
 * @param onError
 */
export default class LoadingManager {
    constructor(onLoad, onProgress, onError) {
        this.onLoad = onLoad;
        this.onProgress = onProgress;
        this.onError = onError;
        this.isLoading = false;
        this.itemsLoaded = 0;
        this.itemsTotal = 0;
        this.urlModifier = undefined;
        this.onStart = undefined;
    }

    /**
     * 用于处理某资源开始时的事件
     * @param url
     */
    itemStart(url) {
        this.itemsTotal++;
        if (this.isLoading === false) {
            if (this.onStart !== undefined) {
                this.onStart(url, this.itemsLoaded, this.itemsTotal);
            }
        }
        this.isLoading = true;
    }

    /**
     * 用于处理某资源结束后的事件
     * @param url
     */
    itemEnd(url) {
        this.itemsLoaded++;
        if (this.onProgress !== undefined) {
            this.onProgress(url, this.itemsLoaded, this.itemsTotal);
        }
        if (this.itemsLoaded === this.itemsTotal) {
            this.isLoading = false;
            if (this.onLoad !== undefined) {
                this.onLoad();
            }
        }
    }

    /**
     * 用于处理出错事件
     * @param url
     */
    itemError(url) {
        if (this.onError !== undefined) {
            this.onError(url);
        }
    }

    /**
     * 使用解析器解析url
     * @param url
     * @return {*}
     */
    resolveURL(url) {
        if (this.urlModifier) {
            return this.urlModifier(url);
        }
        return url;
    }

    /**
     * 自定义解析器
     * @param transform
     * @return {LoadingManager}
     */
    setURLModifier(transform) {
        this.urlModifier = transform;
        return this;
    }
}

const DefaultLoadingManager = new LoadingManager();
export {DefaultLoadingManager};
