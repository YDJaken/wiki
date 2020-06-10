import HashMap from "./HashMap.js";
import  GroundShader from "./GroundShader.js"
export default class DrawTerrainUtil {
    constructor(option = {}) {
        this.viewer = option.viewer;
        this.deep=option.deep||100;
        this.map = new HashMap();
    }
     copy(obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== "object") {
            return;
        }
        for (var i in obj) {
            newobj[i] = typeof obj[i] === "object" ? copy(obj[i]) : obj[i];
        }
        return newobj;
    }
     drawGround(position) {
        let array = this.copy(position);
        for (let i = 0; i < array.length; i += 3) {
            array[i + 2] = -parseFloat(this.deep);
        }
        let ground = this.viewer.entities.add({
            polygon: {
                hierarchy: despCore.Cartesian3.fromDegreesArrayHeights(array),
                perPositionHeight: true,
                material: GroundShader.material
            }
        });
        this.map.put("ground", ground);
    }
     drawLastSide(position) {
        let length = position.length;
        let array = [];
        array.push(parseFloat(position[0]));
        array.push(parseFloat(position[1]));
        array.push(parseFloat(position[2]));
        array.push(parseFloat(position[length - 3]));
        array.push(parseFloat(position[length - 2]));
        array.push(parseFloat(position[length - 1]));
        array.push(parseFloat(position[length - 3]));
        array.push(parseFloat(position[length - 2]));
        array.push(-parseFloat(this.deep));
        array.push(parseFloat(position[0]));
        array.push(parseFloat(position[1]));
        array.push(-parseFloat(this.deep));
        let lastside = this.viewer.entities.add({
            polygon: {
                hierarchy: despCore.Cartesian3.fromDegreesArrayHeights(array),
                perPositionHeight: true,
                material: GroundShader.material
            }
        });
        this.map.put("lastside", lastside);
    }
    //  绘制侧面
     drawSide(position) {
        for (let i = 0; i < position.length - 3; i += 3) {
            let array = [];
            array.push(parseFloat(position[i]));
            array.push(parseFloat(position[i + 1]));
            array.push(parseFloat(position[i + 2]));
            array.push(parseFloat(position[i + 3]));
            array.push(parseFloat(position[i + 4]));
            array.push(parseFloat(position[i + 5]));

            array.push(parseFloat(position[i + 3]));
            array.push(parseFloat(position[i + 4]));
            array.push(-parseFloat(this.deep));
            array.push(parseFloat(position[i]));
            array.push(parseFloat(position[i + 1]));
            array.push(-parseFloat(this.deep));
            let side = this.viewer.entities.add({
                polygon: {
                    hierarchy: despCore.Cartesian3.fromDegreesArrayHeights(array),
                    perPositionHeight: true,
                    material: GroundShader.material
                }
            });
            this.map.put("side" + i, side);
        }
    }
    
     drawTerrain(position){
        this.drawGround(position);
        this.drawLastSide(position);
        this.drawSide(position);
    }

}