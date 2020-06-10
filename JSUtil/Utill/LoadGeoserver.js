/**
 * @Author DY
 */

import Loader from "../../despDB/Loaders/FileLoader.js"
import Check from "./Check.js";

const loader = new Loader();

export default class LoadGeoServer {
    static loadWMTSToJSON(needRec = true, baseUrl = 'http://124.16.184.93:8080/', format = "image/png") {
        this.parser = new DOMParser();
        return new Promise((resolve, reject) => {
            let ret = {
                title: "GeoServer",
                expand: true,
                children: [],
            };
            loader.load(baseUrl + "geoserver/gwc/service/wmts?REQUEST=getcapabilities", (data) => {
                let xml = this.parser.parseFromString(data, 'application/xml');
                let layers = xml.getElementsByTagName("Layer");
                for (let i = 0; i < layers.length; i++) {
                    let child = {};
                    let layer = layers[i];
                    try {
                        let tileName = layer.getElementsByTagName('ows:Identifier');
                        let layerName = undefined, style = undefined;
                        for (let j = 0; j < tileName.length; j++) {
                            if (tileName[j].parentNode === layer) {
                                layerName = tileName[j].innerHTML;
                            } else {
                                style = tileName[j].innerHTML;
                            }
                        }
                        let urlList = layer.getElementsByTagName('ResourceURL');
                        let url = undefined;
                        for (let j = 0; j < urlList.length; j++) {
                            let tmp = urlList[j].getAttribute('format');
                            if (tmp === format) {
                                url = urlList[j].getAttribute('template');
                                url = url.replace('{TileMatrix}', '{TileMatrixSet}:{TileMatrix}');
                                break;
                            }
                        }
                        if (!Check.checkDefined(url)) {
                            continue;
                        }
                        let rectangle = "";
                        if (needRec === true) {
                            rectangle = layer.getElementsByTagName("ows:WGS84BoundingBox")[0];
                            let lower = rectangle.getElementsByTagName('ows:LowerCorner')[0].innerHTML.split(" ");
                            let upper = rectangle.getElementsByTagName('ows:UpperCorner')[0].innerHTML.split(" ");
                            rectangle = `${Number.parseFloat(lower[0])}, ${Number.parseFloat(lower[1])}, ${Number.parseFloat(upper[0])}, ${Number.parseFloat(upper[1])}`;
                        }
                        let tileMatrixSet = layer.getElementsByTagName('TileMatrixSet');
                        let tileSet = undefined, tilingScheme = undefined;
                        for (let j = 0; j < tileMatrixSet.length; j++) {
                            if (tileMatrixSet[j].innerHTML.indexOf("EPSG:4326") !== -1) {
                                tileSet = tileMatrixSet[j].innerHTML;
                                tilingScheme = "Geographic";
                                break;
                            }
                        }
                        if (!Check.checkDefined(tileSet)) {
                            tileSet = tileMatrixSet[0].innerHTML;
                            tilingScheme = "WebMercator";
                        }
                        child.title = layerName;
                        child.layer = {
                            name: layerName,
                            layerOptions: [{
                                type: "wmts",
                                url: url,
                                layer: layerName,
                                style: style,
                                format: format,
                                tileMatrixSetID: tileSet,
                                tilingScheme: tilingScheme
                            }]
                        };
                        if (needRec === true) {
                            child.flyToRec = rectangle;
                            child.layer.layerOptions[0].rectangle = rectangle;
                        }
                        ret.children.push(child);
                    } catch (e) {
                        console.info(e);
                        continue;
                    }
                }
                resolve(ret);
            })
        });
    }

    static loadWMSToJSON(needRec = true, baseUrl = 'http://124.16.184.93:8080/', format = "image/png") {
        this.parser = new DOMParser();
        return new Promise((resolve, reject) => {
            let ret = {
                title: "GeoServer",
                expand: true,
                children: [],
            };
            loader.load(baseUrl + "geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true", (data) => {
                let xml = this.parser.parseFromString(data, 'application/xml');
                debugger
                // todo: 添加geoServerWMS服务支持
                resolve(ret);
            })
        });
    }
}
