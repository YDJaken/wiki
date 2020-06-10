import {dependencies} from "../Constants";
import Coordinate from "../Math/Coordinate";

export default class GeoJSONUtil {
    static converteGeoJSONGeometry(geometry, needOutLine = false, needPrimitive = false) {
        let ret = [];
        let outline = [];
        let coordinates = geometry.coordinates;
        switch (geometry.type) {
            case "MultiLineString":
                for (let i = 0; i < coordinates.length; i++) {
                    ret.push(GeoJSONUtil.handlePolyLinePosition(coordinates[i]));
                }
                break;
            case "LineString":
                ret.push(GeoJSONUtil.handlePolyLinePosition(coordinates));
                break;
            case "Polygon":
                if (needPrimitive === true) {
                    ret.push(GeoJSONUtil.handlePolygonPositionPrimative(coordinates[0]));
                    if (needOutLine) {
                        outline.push(GeoJSONUtil.handlePolygonPositionOutLinePrimative(coordinates[0]));
                    }
                } else {
                    ret.push(GeoJSONUtil.handlePolygonPosition(coordinates[0]));
                }

                break;
            case "MultiPolygon":
                for (let i = 0; i < coordinates.length; i++) {
                    if (needPrimitive === true) {
                        ret.push(GeoJSONUtil.handlePolygonPositionPrimative(coordinates[i][0]));
                        if (needOutLine) {
                            outline.push(GeoJSONUtil.handlePolygonPositionOutLinePrimative(coordinates[i][0]));
                        }
                    } else {
                        ret.push(GeoJSONUtil.handlePolygonPosition(coordinates[i][0]));
                    }
                }
                break;
            default:
                console.log(geometry.type);
                break;
        }

        if (needOutLine) {
            ret.push(outline);
        }
        return ret;
    }

    static handlePolyLinePosition(coordinates, id = "GeoJSONPolyLine") {
        let position = [];
        for (let j = 0; j < coordinates.length; j++) {
            position.push(...coordinates[j], 0);
        }
        return Coordinate.handlePosition(position);
    }

    static handlePolygonPositionOutLinePrimative(coordinates, id = "GeoJSONPolygon") {
        let position = [];
        for (let j = 0; j < coordinates.length; j++) {
            position.push(...coordinates[j], 0);
        }

        return new dependencies.Cesium.GeometryInstance({
            geometry: new dependencies.Cesium.PolygonOutlineGeometry({
                polygonHierarchy: new dependencies.Cesium.PolygonHierarchy(Coordinate.handlePosition(position)),
                height: 0.0,
                extrudedHeight: 0.0,
                vertexFormat: dependencies.Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
            modelMatrix: dependencies.Cesium.Matrix4.IDENTITY.clone(),
            id: id
        });
    }

    static handlePolygonPositionPrimative(coordinates, id = "GeoJSONPolygon") {
        let position = [];
        for (let j = 0; j < coordinates.length; j++) {
            position.push(...coordinates[j], 0);
        }

        return new dependencies.Cesium.GeometryInstance({
            geometry: new dependencies.Cesium.PolygonGeometry({
                polygonHierarchy: new dependencies.Cesium.PolygonHierarchy(Coordinate.handlePosition(position)),
                height: 0.0,
                extrudedHeight: 0.0,
                vertexFormat: dependencies.Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
            modelMatrix: dependencies.Cesium.Matrix4.IDENTITY.clone(),
            id: id
        });
    }

    static handlePolygonPosition(coordinates, id = "GeoJSONPolygon") {
        let position = [];
        for (let j = 0; j < coordinates.length; j++) {
            position.push(...coordinates[j], 0);
        }

        return Coordinate.handlePosition(position);
    }
}
