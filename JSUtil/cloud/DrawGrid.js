import ObjectUtil from "@/despUtil/Util/ObjectUtil";
import Check from "@/despUtil/Util/Check";
import {dependencies, despDefaultColorArray} from "@/despCore/Constants";
import {DrawGridVS, DrawGridFS} from "../shader/main";
import Coordinate from "@/despCore/Math/Coordinate";
import MovePrimitive from "@/despCore/Primitive/MovePrimitive";
import MRectangle from "@/despCore/Math/Rectangle";
import loadToString from "@/despUtil/Util/loadToString";

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

        this.time = 0.0;

        this._generateIndex();
    }

    applyTime(time) {
        if (time < 0.0) {
            time = 0.0;
        } else if (time > 1.0) {
            time = 1.0;
        }
        this.time = time;
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

        let geometry = new dependencies.Cesium.GeometryInstance({
            geometry: new dependencies.Cesium.RectangleGeometry({
                rectangle: rectangle,
                granularity: interval,
                vertexFormat: dependencies.Cesium.VertexFormat.POSITION_AND_ST
            })
        });

        let fabric = {
            fabric: {
                type: "Image",
                uniforms: {}
            }
        };

        fabric.fabric.uniforms["origin"] = {
            x: Coordinate.angleToRadian(this.originX),
            y: Coordinate.angleToRadian(this.originY)
        };

        fabric.fabric.uniforms["interval"] = {
            x: Coordinate.angleToRadian(this.xInterval),
            y: Coordinate.angleToRadian(this.yInterval)
        };

        fabric.fabric.uniforms["gridSize"] = {x: this.xGridSize, y: this.yGridSize};

        fabric.fabric.uniforms["controlNumber"] = {
            x: this.minHeight,
            y: this.maxHeight,
            z: this.min,
            w: this.max
        };

        let addStr = "";
        let addStr2 = "";
        fabric.fabric.uniforms["time"] = this.time;

        if (!Check.Array(this.data)) {
            fabric.fabric.uniforms["image"] = this.data;
            addStr += "uniform sampler2D image_5;"
            addStr2 += `vec4 getCurrentColor(in float time, in vec2 frac){return texture2D(image_5,frac);}`
            addStr2 += `vec4 getNextColor(in float time, in vec2 frac){return texture2D(image_5,frac);}`
            addStr2 += `float getStep(in float time){return 0.;}`
        } else {
            for (let i = 0; i < this.data.length; i++) {
                if (Check.function(this.data[i])) {
                    fabric.fabric.uniforms["image_" + i] = this.data[i]();
                } else {
                    fabric.fabric.uniforms["image_" + i] = this.data[i];
                }
                addStr += `uniform sampler2D image_${i}_${5 + i};`
            }
            addStr2 += `vec4 getCurrentColor(in float time, in vec2 frac){${this._loadShader(this.data.length, 0)}}`;
            addStr2 += `vec4 getNextColor(in float time, in vec2 frac){${this._loadShader(this.data.length, 1)}}`;
            if (this.needLerp) {
                addStr2 += `float getStep(in float time){${this._loadShader(this.data.length, 2)}}`;
            } else {
                addStr2 += `float getStep(in float time){return 0.;}`;
            }
        }

        let primitive = new dependencies.Cesium.Primitive({
            geometryInstances: geometry,
            show: this.show,
            appearance: new dependencies.Cesium.MaterialAppearance({
                material: new dependencies.Cesium.Material(fabric),
                fragmentShaderSource: loadToString.toString(DrawGridFS),
                vertexShaderSource: addStr + addStr2 + loadToString.toString(DrawGridVS),
                aboveGround: true
            }),
            modelMatrix: MovePrimitive.Mat(),
        });

        let origin = primitive.update;
        primitive.update = (frameState) => {
            primitive.appearance.material.uniforms['time'] = this.time;
            if (Check.Array(this.data)) {
                for (let i = 0; i < this.data.length; i++) {
                    if (Check.function(this.data[i])) {
                        primitive.appearance.material.uniforms["image_" + i] = this.data[i]();
                    }
                }
            }
            origin.call(primitive, frameState);
        }

        this.primitiveCollection.add(primitive);

        this.removeCallback = () => {
            this.primitiveCollection.remove(primitive);
        }
    }

    _loadShader(length, type) {
        let str = `float count = time * ${length - 1}.0;`
        switch (type) {
            case 0:
                str += `count = floor(count);`
                for (let i = 0; i < length; i++) {
                    str += `if(count == ${i}.0){ return texture2D(image_${i}_${5 + i},frac);}`
                }
                break;
            case 1:
                str += `count = ceil(count);`
                for (let i = 0; i < length; i++) {
                    str += `if(count == ${i}.0){  return texture2D(image_${i}_${5 + i},frac);}`
                }
                break;
            case 2:
                str += `return fract(count);`
                break;
        }
        return str;
    }

    _reboundLon(lon) {
        return lon;
    }

    _reboundLat(lat) {
        return lat;
    }

    setProperty(obj) {
        ObjectUtil.setProperties(this, obj);
    }

    setNeedLerp(needLerp) {
        this.needLerp = needLerp !== false;
        return this;
    }

    setMaxHeight(maxHeight) {
        this.maxHeight = Check.number(maxHeight) ? maxHeight : 300000;
        return this;
    }


    setMinHeight(minHeight) {
        this.minHeight = Check.number(minHeight) ? minHeight : 200000;
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
        if (this.removeCallback) {
            this.removeCallback();
        }
    }

    destroy() {
        this.delete();
        this.primitiveCollection = null;
        ObjectUtil.delete(this);
    }
}
