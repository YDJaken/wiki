/**
 * @Author DY
 */

import Check from "../../despUtil/Util/Check";
import GLUtil from "../../despUtil/Util/GLUtil";
import EarthVS from "../shader/EarthVS.glsl";
import EarthFS from "../shader/EarthFS.glsl";
import {dependencies} from "@/despCore/Constants";
import ObjectUtil from "../../despUtil/Util/ObjectUtil";

export default class DrawSphere {
    constructor(obj = {}) {
        if (!Check.checkDefined(obj.viewer)) {
            throw new Error("viewer is needed.");
        }

        this.viewer = obj.viewer;
        this.gl = this.viewer.scene.context._gl;
        this.context = this.viewer.scene.context;

        this.EarthShader = GLUtil.createProgram(this.gl, EarthVS, EarthFS);

        let radius = 6378400.0;
        let arc = 256.0;
        // 底层蒙皮的几何信息
        this.earthGeo = new dependencies.Cesium.EllipsoidGeometry({
            radii: new dependencies.Cesium.Cartesian3(radius, radius, radius),
            stackPartitions: arc,
            slicePartitions: arc,
            vertexFormat: dependencies.Cesium.VertexFormat.POSITION_ONLY,
            // vertexFormat: dependencies.Cesium.VertexFormat.POSITION_AND_NORMAL,
        });
        // 用于记录几何蒙皮的顶点信息
        this.earthVertex = null;
    }

    draw() {
        const gl = this.gl;
        if (this.earthVertex === null) {
            this.generateVertex();
        }

        if (this.destroied === true) {
            return;
        }

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.enable(gl.BLEND);
        gl.enable(gl.CULL_FACE);

        this.drawSphere();
    }

    drawSphere() {
        const gl = this.gl;
        const program = this.EarthShader;
        const us = this.context._us;

        gl.useProgram(program.program);

        GLUtil.bindAttribute(gl, this.earthVertexHighBuffer, program["v_posHeigh"], 3);
        GLUtil.bindAttribute(gl, this.earthVertexLowBuffer, program["v_posLow"], 3);
        // GLUtil.bindAttribute(gl, this.earthVertexNormalBuffer, program["normal"], 3);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.earthIndexBuffer);

        // gl.uniform1f(program.gamma, us.gamma);

        let hight = us.encodedCameraPositionMCHigh;
        gl.uniform3f(program.encodedCameraPositionMCHigh, hight.x, hight.y, hight.z);
        let low = us.encodedCameraPositionMCLow;
        gl.uniform3f(program.encodedCameraPositionMCLow, low.x, low.y, low.z);

        // gl.uniform1fv(program.pops, [50.0, 20.0, 30.0, 40.0]);

        gl.uniformMatrix4fv(program.modelViewProjectionRelativeToEye, false, dependencies.Cesium.Matrix4.toArray(us.modelViewProjectionRelativeToEye));
        // gl.uniformMatrix4fv(program.modelViewRelativeToEye, false, dependencies.Cesium.Matrix4.toArray(us.modelViewRelativeToEye));

        gl.drawElements(gl.TRIANGLES, this.earthVertex.indices.length, gl.UNSIGNED_INT, 0);
        // gl.drawElements(gl.TRIANGLES, this.earthVertex.indices.length, gl.UNSIGNED_BYTE, 0);
    }

    /**
     * 用于生成几何蒙皮的顶点信息
     * @date 2019/5/8
     * @methodOf: WindVisShader
     */
    generateVertex() {
        if (this.earthVertex === null) {
            this.earthVertex = dependencies.Cesium.EllipsoidGeometry.createGeometry(this.earthGeo);
            this.earthVertex = dependencies.Cesium.GeometryPipeline.encodeAttribute(this.earthVertex, 'position', 'position3DHigh', 'position3DLow');
            this.earthIndexBuffer = GLUtil.createBuffer(this.gl, this.earthVertex.indices, this.gl.ELEMENT_ARRAY_BUFFER, this.gl.STATIC_DRAW);
            // this.earthVertexNormalBuffer = GLUtil.createBuffer(this.gl, this.earthVertex.attributes.normal.values, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW);
            this.earthVertexHighBuffer = GLUtil.createBuffer(this.gl, this.earthVertex.attributes.position3DHigh.values, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW);
            this.earthVertexLowBuffer = GLUtil.createBuffer(this.gl, this.earthVertex.attributes.position3DLow.values, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW);
        }
        return this.earthVertex;
    }

    destroy() {
        if (Check.checkDefined(this.earthIndexBuffer)) {
            GLUtil.deleteBuffer(this.gl, this.earthIndexBuffer);
        }
        // if (Check.checkDefined(this.earthVertexNormalBuffer)) {
        //     GLUtil.deleteBuffer(this.gl, this.earthVertexNormalBuffer);
        // }
        if (Check.checkDefined(this.earthVertexHighBuffer)) {
            GLUtil.deleteBuffer(this.gl, this.earthVertexHighBuffer);
        }
        if (Check.checkDefined(this.earthVertexLowBuffer)) {
            GLUtil.deleteBuffer(this.gl, this.earthVertexLowBuffer);
        }
        if (Check.checkDefined(this.EarthShader)) {
            GLUtil.deleteProgram(this.gl, this.EarthShader);
        }
        ObjectUtil.deleteComplete(this.earthVertex);
        ObjectUtil.delete(this);
        this.destroied = true;
    }

}