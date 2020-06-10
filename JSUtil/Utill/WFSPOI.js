import Point from "../Entity/Point";
import {dependencies} from "../Constants";
import Check from "./Check";

/**
 * @Author DY
 */
export default class WFSPOI {
    static generateWFSPOIURL(filter = 'restaurant', BBOX = "116.38486862182617,39.89736557006836,116.4195442199707,39.93204116821289", perfix = "http://localhost:8080/geoserver/wfs", layerName = "cite:China_POIs_201911") {
        let bboxs = BBOX.split(',');
        BBOX = `${bboxs[1]},${bboxs[0]},${bboxs[3]},${bboxs[2]}`;
        return `${perfix}?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&outputFormat=json&typename=${layerName}&count=50&srsName=EPSG%3A4326&cql_filter=BBOX(the_geom%2c${BBOX})%20AND%20fclass%3D%27${filter}%27`;
    }

    static HandlePOIResult(result, entityCollection, type, filter = function () {
        return true;
    }, scope = undefined) {
        if (Check.string(result)) {
            result = JSON.parse(result);
        }
        let ret = [];
        let pois = result.features;
        for (let i = 0; i < pois.length; i++) {
            let target = pois[i];
            let coordinates = target.geometry.coordinates;
            let location = {
                lng: coordinates[0],
                lat: coordinates[1]
            };
            target.location = location;
            if (filter.call(scope, target)) {
                let point = new Point({
                    collection: entityCollection,
                    position: [location.lng, location.lat, 0],
                    text: target.properties.name + "*",
                    scale: 0.75,
                    show: false
                });
                if (i === 1) {
                    point.translucencyByDistance = undefined;
                } else {
                    point.translucencyByDistance = new dependencies.Cesium.NearFarScalar(10000, 1, 100000, 0)
                }
                let detailInfo = {
                    name: point.text,
                    type: type
                };
                point.setAttr("detailInfo", detailInfo);
                ret.push(point);
            }
        }

        return ret;
    }
}
