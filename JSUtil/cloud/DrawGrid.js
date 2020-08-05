import ObjectUtil from "@/despUtil/Util/ObjectUtil";
import Check from "@/despUtil/Util/Check";
import {dependencies, despDefaultColorArray} from "@/despCore/Constants";
import DrawGridVS from "../shader/DrawGridVS.glsl";
import DrawGridFS from "../shader/DrawGridFS.glsl";
import Coordinate from "@/despCore/Math/Coordinate";
import MovePrimitive from "@/despCore/Primitive/MovePrimitive";
import MRectangle from "@/despCore/Math/Rectangle";

/**
 * @author DY
 */
export default class DrawGrid {
    constructor(obj) {
        if (!Check.checkDefined(obj.collection)) {
            throw new Error("primitiveCollection is needed.");
        }
        this.primitiveCollection = obj.collection;

        this.setProperty(obj);

        this._generateIndex();
    }

    _generateIndex() {
        let interval = Math.min(Math.abs(this.xInterval), Math.abs(this.yInterval));
        interval = Coordinate.angleToRadian(interval);
        let xLength = this.xInterval * this.xGridSize;
        let yLength = this.yInterval * this.yGridSize;
        let rectangle;
        if (Math.abs(xLength) >= 359 || Math.abs(yLength) >= 179) {
            rectangle = MRectangle.getMaxRec();
        } else {
            rectangle = MRectangle.fromArrayD([this.originX, this.originY, this.originX + xLength, this.originY + yLength]);
        }

        let tmpGeo = dependencies.Cesium.RectangleGeometry.createGeometry(new dependencies.Cesium.RectangleGeometry({
            rectangle: rectangle,
            granularity: interval,
            vertexFormat: dependencies.Cesium.VertexFormat.POSITION_AND_ST
        }));

        let geometry = new dependencies.Cesium.GeometryInstance({
            geometry: new dependencies.Cesium.RectangleGeometry({
                rectangle: rectangle,
                granularity: interval,
                vertexFormat: dependencies.Cesium.VertexFormat.POSITION_AND_ST
            })
        });
        this.primitive = new dependencies.Cesium.Primitive({
            geometryInstances: geometry,
            show: this.show,
            releaseGeometryInstances: false,
            asynchronous: false,
            appearance: new dependencies.Cesium.MaterialAppearance({
                material: new dependencies.Cesium.Material({
                    fabric: {
                        type: "Image",
                        uniforms: {
                            image: this.data,
                            origin: {
                                x: Coordinate.angleToRadian(this.originX),
                                y: Coordinate.angleToRadian(this.originY)
                            },
                            interval: {
                                x: Coordinate.angleToRadian(this.xInterval),
                                y: Coordinate.angleToRadian(this.yInterval)
                            },
                            gridSize: {x: this.xGridSize, y: this.yGridSize},
                            controlNumber:{
                                x: this.minHeight,
                                y: this.maxHeight,
                                z: this.min,
                                w: this.max
                            }
                        }
                    }
                }),
                fragmentShaderSource: this.fragmentShaderSource,
                vertexShaderSource: this.vertexShaderSource,
                aboveGround: true
            }),
            modelMatrix: MovePrimitive.Mat(),
        });
        this.primitiveCollection.add(this.primitive);
    }

    _reboundLon(lon) {
        // if (lon > 180) {
        //     return -180 + (lon - 180);
        // } else if (lon < -180) {
        //     return 180 + (lon + 180);
        // } else {
        return lon;
        // }
    }

    _reboundLat(lat) {
        return lat;
    }

    setProperty(obj) {
        ObjectUtil.setProperties(this, obj);
    }

    setMaxHeight(maxHeight){
        this.maxHeight = Check.number(maxHeight)? maxHeight: 400000;
        return this;
    }


    setMinHeight(minHeight){
        this.minHeight = Check.number(minHeight)? minHeight: 100000;
        return this;
    }

    setFragmentShaderSource(fragmentShaderSource) {
        this.fragmentShaderSource = Check.checkDefined(fragmentShaderSource) ? fragmentShaderSource : DrawGridFS;
        return this;
    }

    setVertexShaderSource(vertexShaderSource) {
        this.vertexShaderSource = Check.checkDefined(vertexShaderSource) ? vertexShaderSource : DrawGridVS;
        return this;
    }

    setData(data) {
        if (Check.checkDefined(data)) {
            this.data = data;
        } else {
            throw new Error(" data is needed!")
        }
        return this;
    }

    setOriginY(originY) {
        this.originY = Check.number(originY) ? originY : 0;
        return this;
    }

    setOriginX(originX) {
        this.originX = Check.number(originX) ? originX : 0;
        return this;
    }

    setYInterval(yInterval) {
        this.yInterval = Check.number(yInterval) ? yInterval : 0;
        return this;
    }

    setXInterval(xInterval) {
        this.xInterval = Check.number(xInterval) ? xInterval : 0;
        return this;
    }

    setYGridSize(yGridSize) {
        this.yGridSize = Check.number(yGridSize) ? yGridSize : 0;
        return this;
    }

    setXGridSize(xGridSize) {
        this.xGridSize = Check.number(xGridSize) ? xGridSize : 0;
        return this;
    }

    setHeight(height) {
        this.height = Check.number(height) ? height : 10;
        return this;
    }

    setColorScheme(colorScheme) {
        if (Check.Array(colorScheme)) {
            this.colorScheme = colorScheme;
        } else if (Check.string(colorScheme)) {
            this.colorScheme = colorScheme.split(',');
        } else {
            this.colorScheme = despDefaultColorArray;
        }
        return this;
    }

    setMin(min) {
        this.min = Check.number(min) ? min : 0;
        return this;
    }

    setMax(max) {
        this.max = Check.number(max) ? max : 0;
        return this;
    }

    setShow(show) {
        this.show = show !== false;
        return this;
    }

    delete() {
        if (this.primitive !== null) {
            this.primitiveCollection.remove(this.primitive);
            this.primitive = null;
        }
    }

    destroy() {
        this.delete();
        this.primitiveCollection = null;
        ObjectUtil.delete(this);
    }
}
