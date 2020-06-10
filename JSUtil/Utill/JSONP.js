import {dependencies} from "../Constants";

/**
 * @Author DY
 */
export default class JSON {
    static sendJSONP(url, success = () => {
    }, error = () => {
    }) {
        dependencies.Cesium.Resource.fetchJsonp({
            url: url, headers: {
                "Content-Type": 'application/json; charset=utf-8',
            }
        }).then(success, error);
        // dependencies.jquery.ajax({
        //     url: url,
        //     type: 'GET',
        //     async: true,
        //     dataType: 'jsonp',
        //     timeout: 50000,
        //     contentType: 'application/json; charset=utf-8',
        //     success: success,
        //     error: error
        // })
    }

    static getJSON(url, success = () => {
    }, error = () => {
    }) {
        dependencies.Cesium.Resource.fetchJson({
            url: url, headers: {
                "Content-Type": 'application/json; charset=utf-8',
            }
        }).then(success, error);
        // dependencies.jquery.ajax({
        //     url: url,
        //     type: 'GET',
        //     async: true,
        //     timeout: 50000,
        //     contentType: 'application/json; charset=utf-8',
        //     success: success,
        //     error: error
        // })
    }

}
