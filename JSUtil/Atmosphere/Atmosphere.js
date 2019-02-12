/**
 * 大气层
 * @Author DongYi
 */
import {ShaderMaterial} from "../src/Materials/ShaderMaterial.js";
import {SphereBufferGeometry} from "../src/Geometries/SphereGeometry.js";
import {Mesh} from "../src/Geometry/Mesh.js";
import {EarthRadius, BackSide, FrontSide, DoubleSide, NormalBlending} from "../src/Core/Constants.js";
import {Color} from "../src/Datum/Math/Color.js";

const customMaterialAtmosphere = new ShaderMaterial({
    uniforms: {
        coeficient: {
            type: "f",
            value: 1
        },
        power: {
            type: "f",
            value: 2
        },
        glowColor: {
            type: "c",
            value: new Color('floralwhite')
        }
    },
    vertexShader: [
        'varying vec3	vVertexWorldPosition;',
        'varying vec3	vVertexNormal;',
        'varying vec4	vFragColor;',
        'void main(){',
        '	vVertexNormal	= normalize(normalMatrix * normal);',
        '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',
        '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
    ].join('\n'),
    fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',
        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',
        'varying vec4	vFragColor;',
        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',
        '   float cosOfNormal = dot(vVertexNormal, viewCameraToVertex);',
        '	float intensity		= pow(coeficient + cosOfNormal, power);',
        '   if(intensity < 0.58) {intensity = 0.0;}',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'
    ].join('\n'),
    blending: NormalBlending,
    transparent:
        true

});

class atmosphere {
    constructor() {
        this.radius = 0;
        this.segments = 0;
        this.fov = 0;
        this.aspect = 0;
        this.near = 0;
        this.far = 0;
        this.usingAtmosphere = false;
        this.loaded = false;
        this.mesh = undefined;
    }

    init() {
        if (!window.top.Speed3D.sphere) return;
        this.radius = EarthRadius;
        this.segments = 32;
        this.loaded = true;
    }

    active() {
        if (this.mesh === undefined) {
            let sphere = new SphereBufferGeometry(this.radius, this.segments, this.segments);
            let mesh = new Mesh(sphere, customMaterialAtmosphere);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.03;
            mesh.material.side = FrontSide;
            this.mesh = mesh;
            window.top.Speed3D.scene.add(mesh);
        }
        if (this.usingAtmosphere !== true) this.usingAtmosphere = this.mesh.visible = true;
    }

    deActive() {
        if (this.usingAtmosphere !== false) this.usingAtmosphere = this.mesh.visible = false;
    }

}

const Atmosphere = new atmosphere();
export {Atmosphere}