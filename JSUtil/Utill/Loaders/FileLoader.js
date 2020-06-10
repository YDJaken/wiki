import {Cache} from './Cache.js';
import {DefaultLoadingManager} from './LoadingManager.js';

const loading = {};
/**
 * @class FileLoader
 * @classdes 文件加载器
 * @param {manager}
 */
export default class FileLoader {
    constructor(forceLoad = false, manager = DefaultLoadingManager) {
        this.manager = manager;
        this.forceLoad = forceLoad;
    }

    /**
     * 加载文件
     * @param url
     * @param onLoad
     * @param onProgress
     * @param onError
     * @return {*}
     */
    load(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path !== undefined) url = this.path + url;
        url = this.manager.resolveURL(url);
        let scope = this;
        let cached = Cache.get(url);
        if (cached !== undefined && this.forceLoad === false) {
            scope.manager.itemStart(url);
            setTimeout(function () {
                if (onLoad) onLoad(cached);
                scope.manager.itemEnd(url);
            }, 0);
            return cached;
        }
        // 检查请求是否重复
        if (loading[url] !== undefined) {
            loading[url].push({
                onLoad: onLoad,
                onProgress: onProgress,
                onError: onError
            });
            return;
        }
        let dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
        let dataUriRegexResult = url.match(dataUriRegex);
        let request;
        if (dataUriRegexResult) {
            let mimeType = dataUriRegexResult[1];
            let isBase64 = !!dataUriRegexResult[2];
            let data = dataUriRegexResult[3];
            data = window.decodeURIComponent(data);
            if (isBase64) data = window.atob(data);
            try {
                let response;
                let responseType = (this.responseType || '').toLowerCase();
                switch (responseType) {
                    case 'arraybuffer':
                    case 'blob':
                        let view = new Uint8Array(data.length);
                        for (let i = 0; i < data.length; i++) {
                            view[i] = data.charCodeAt(i);
                        }
                        if (responseType === 'blob') {
                            response = new Blob([view.buffer], {type: mimeType});
                        } else {
                            response = view.buffer;
                        }
                        break;
                    case 'document':
                        let parser = new DOMParser();
                        response = parser.parseFromString(data, mimeType);
                        break;
                    case 'json':
                        response = JSON.parse(data);
                        break;
                    default:
                        response = data;
                        break;
                }
                window.setTimeout(function () {
                    if (onLoad) onLoad(response);
                    scope.manager.itemEnd(url);
                }, 0);
            } catch (error) {
                window.setTimeout(function () {
                    if (onError) onError(error);
                    scope.manager.itemEnd(url);
                    scope.manager.itemError(url);
                }, 0);
            }
        } else {
            loading[url] = [];
            loading[url].push({
                onLoad: onLoad,
                onProgress: onProgress,
                onError: onError
            });
            request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.addEventListener('load', function (event) {
                let response = this.response;
                Cache.add(url, response);
                let callbacks = loading[url];
                delete loading[url];
                if (this.status === 200 || this.status === 0) {
                    if (this.status === 0) console.warn('FileLoader: HTTP Status 0 received.');
                    for (let i = 0, il = callbacks.length; i < il; i++) {
                        let callback = callbacks[i];
                        if (callback.onLoad) callback.onLoad(response);
                    }
                    scope.manager.itemEnd(url);
                } else {
                    for (let i = 0, il = callbacks.length; i < il; i++) {
                        let callback = callbacks[i];
                        if (callback.onError) callback.onError(event);
                    }
                    scope.manager.itemEnd(url);
                    scope.manager.itemError(url);
                }
            }, false);
            request.addEventListener('progress', function (event) {
                let callbacks = loading[url];
                for (let i = 0, il = callbacks.length; i < il; i++) {
                    let callback = callbacks[i];
                    if (callback.onProgress) callback.onProgress(event);
                }
            }, false);
            request.addEventListener('error', function (event) {
                let callbacks = loading[url];
                delete loading[url];
                for (let i = 0, il = callbacks.length; i < il; i++) {
                    let callback = callbacks[i];
                    if (callback.onError) callback.onError(event);
                }
                scope.manager.itemEnd(url);
                scope.manager.itemError(url);
            }, false);
            if (this.responseType !== undefined) request.responseType = this.responseType;
            if (this.withCredentials !== undefined) request.withCredentials = this.withCredentials;
            if (request.overrideMimeType) request.overrideMimeType(this.mimeType !== undefined ? this.mimeType : 'text/plain');
            for (let header in this.requestHeader) {
                request.setRequestHeader(header, this.requestHeader[header]);
            }
            request.send(null);
        }
        scope.manager.itemStart(url);

        return request;

    }

    /**
     * 设置根目录
     * @param value
     * @return {FileLoader}
     */
    setPath(value) {
        this.path = value;
        return this;
    }

    /**
     * 设置返回结果的格式
     * @param value
     * @return {FileLoader}
     */
    setResponseType(value) {
        this.responseType = value;
        return this;
    }

    /**
     * 设置请求的跨域属性 withCredentials
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
     * @param value
     * @return {FileLoader}
     */
    setWithCredentials(value) {
        this.withCredentials = value !== false;
        return this;
    }

    /**
     * 设置请求的 mineType
     * @param value
     * @return {FileLoader}
     */
    setMimeType(value) {
        this.mimeType = value;
        return this;
    }

    /**
     * 设置请求头
     * @param value
     * @return {FileLoader}
     */
    setRequestHeader(value) {
        this.requestHeader = value;
        return this;
    }
}
