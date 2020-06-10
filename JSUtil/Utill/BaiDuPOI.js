import {BDAK} from "../Constants.js"
import Check from "./Check.js";
import Point from "../Entity/Point";
import {dependencies} from "../Constants";

/**
 * @Author DY
 */
export default class BaiDuPOI {

    static generatePOIURL(lon, lat, radius = 1000, query = "政府机构&医疗&写字楼") {
        return `http://api.map.baidu.com/place/v2/search?ak=${BDAK}&query=${query}&location=${lat},${lon}&radius=${radius}&radius_limit=true&output=json&scope=2&coord_type=1&page_size=10&page_num=0`;
    }

    static HandlePOIResult(result, entityCollection, type, filter = function () {
        return true;
    }, scope = undefined) {
        if (result.status !== 0) {
            return result.message;
        }
        let ret = [];
        let pois = result.results;
        for (let i = 0; i < pois.length; i++) {
            let target = pois[i];
            let location = target.location;
            if (filter.call(scope, target)) {
                let point = new Point({
                    collection: entityCollection,
                    position: [location.lng, location.lat, 0],
                    text: target.name,
                    scale: 0.75,
                    show: false
                });
                if (i === 1) {
                    point.translucencyByDistance = undefined;
                } else {
                    point.translucencyByDistance = new dependencies.Cesium.NearFarScalar(10000, 1, 100000, 0)
                }
                let tmp = target.detail_info;
                let detailInfo = {
                    name: target.name,
                    address: target.province + target.city + target.area + target.address,
                    distance: tmp.distance,
                    url: tmp.detail_url,
                    type: type
                };
                point.setAttr("detailInfo", detailInfo);
                ret.push(point);
            }
        }

        return ret;
    }

    static stringChecker(string) {
        if (Check.checkDefined(string) && string !== '') {
            return string;
        } else {
            return "暂缺";
        }
    }


    static handelInfoToHTML(point) {
        let ret = "";
        let detailInfo = point.getAttr("detailInfo");
        if (Check.checkDefined(detailInfo)) {
            ret = `<table style="width: 400px">
            <tr>
              <td>名称:</td>
              <td>${BaiDuPOI.stringChecker(detailInfo.name)}</td>
            </tr>
             <tr>
              <td>地址:</td>
              <td>${BaiDuPOI.stringChecker(detailInfo.address)}</td>
            </tr>
             <tr>
              <td>位置:</td>
              <td>${BaiDuPOI.stringChecker(point.position[0])},${BaiDuPOI.stringChecker(point.position[1])}</td>
            </tr>
          </table>`;
        }
        return ret;
    }
}
