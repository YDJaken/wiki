import despCore from "despCore";
import axios from "axios";
let demo;
demo = despCore.defaultValue(demo, true);
let colorTable = {
  ncolors: 70,
  colorTable: [
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.0,
    0.941176,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.137255,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.352941,
    1.0,
    1.0,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.54902,
    1.0,
    0.901961,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.647059,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.764706,
    1.0,
    0.843137,
    0.823529,
    1.0,
    0.843137,
    0.823529,
    1.0,
    0.843137,
    0.823529,
    1.0,
    0.843137,
    0.823529,
    1.0,
    0.843137,
    0.823529,
    1.0,
    0.843137,
    0.901961,
    1.0,
    0.941176,
    0.901961,
    1.0,
    0.941176,
    0.901961,
    1.0,
    0.941176,
    0.921569,
    1.0,
    1.0,
    0.921569,
    1.0,
    1.0
  ]
};
const fileOptions = {
  dataDirectory: "./../assets/data/",
  dataFile: "demo.nc",
  glslDirectory: "./glsl/"
};
let fullscreenpath = require("./glsl/fullscreen.vert");
let getWindpath = require("./glsl/getWind.frag");
let postProcessingPositionpath = require("./glsl/postProcessingPosition.frag");
let postProcessingSpeedpath = require("./glsl/postProcessingSpeed.frag");
let screenDrawpath = require("./glsl/screenDraw.frag");
let segmentDrawpath = require("./glsl/segmentDraw.frag");
let segmentDrawvertpath = require("./glsl/segmentDraw.vert");
let trailDrawpath = require("./glsl/trailDraw.frag");
let updatePositionpath = require("./glsl/updatePosition.frag");
let updatespeedpath = require("./glsl/updateSpeed.frag");

const defaultParticleSystemOptions = {
  maxParticles: 64 * 64,
  particleHeight: 100.0,
  fadeOpacity: 0.996,
  dropRate: 0.003,
  dropRateBump: 0.01,
  speedFactor: 4.0,
  lineWidth: 4.0
};

const globeLayers = [
  { name: "NaturalEarthII", type: "NaturalEarthII" },
  {
    name: "WMS:Rainfall",
    type: "WMS",
    layer: "Precipitable_water_entire_atmosphere_single_layer",
    ColorScaleRange: "0.1,66.8"
  },
  {
    name: "WMS:Air Pressure",
    type: "WMS",
    layer: "Pressure_surface",
    ColorScaleRange: "51640,103500"
  },
  {
    name: "WMS:Temperature",
    type: "WMS",
    layer: "Temperature_surface",
    ColorScaleRange: "204.1,317.5"
  },
  {
    name: "WMS:Wind Speed",
    type: "WMS",
    layer: "Wind_speed_gust_surface",
    ColorScaleRange: "0.1095,35.31"
  },
  { name: "WorldTerrain", type: "WorldTerrain" }
];

const defaultLayerOptions = {
  globeLayer: globeLayers[0],
  WMS_URL:
    "https://www.ncei.noaa.gov/thredds/wms/model-gfs-g4-anl-files/201809/20180916/gfsanl_4_20180916_0000_000.grb2"
};

export class Panel {
  constructor() {
    this.maxParticles = defaultParticleSystemOptions.maxParticles;
    this.particleHeight = defaultParticleSystemOptions.particleHeight;
    this.fadeOpacity = defaultParticleSystemOptions.fadeOpacity;
    this.dropRate = defaultParticleSystemOptions.dropRate;
    this.dropRateBump = defaultParticleSystemOptions.dropRateBump;
    this.speedFactor = defaultParticleSystemOptions.speedFactor;
    this.lineWidth = defaultParticleSystemOptions.lineWidth;

    this.globeLayer = defaultLayerOptions.globeLayer;
    this.WMS_URL = defaultLayerOptions.WMS_URL;
  }

  getUserInput () {
    // make sure maxParticles is exactly the square of particlesTextureSize
    var particlesTextureSize = Math.ceil(Math.sqrt(this.maxParticles));
    this.maxParticles = particlesTextureSize * particlesTextureSize;

    return {
      particlesTextureSize: particlesTextureSize,
      maxParticles: this.maxParticles,
      particleHeight: this.particleHeight,
      fadeOpacity: this.fadeOpacity,
      dropRate: this.dropRate,
      dropRateBump: this.dropRateBump,
      speedFactor: this.speedFactor,
      lineWidth: this.lineWidth,
      globeLayer: this.globeLayer,
      WMS_URL: this.WMS_URL
    };
  }
}

class CustomPrimitive {
  constructor(options) {
    this.commandType = options.commandType;

    this.geometry = options.geometry;
    this.attributeLocations = options.attributeLocations;
    this.primitiveType = options.primitiveType;

    this.uniformMap = options.uniformMap;

    this.vertexShaderSource = options.vertexShaderSource;
    this.fragmentShaderSource = options.fragmentShaderSource;

    this.rawRenderState = options.rawRenderState;
    this.framebuffer = options.framebuffer;

    this.outputTexture = options.outputTexture;

    this.autoClear = despCore.defaultValue(options.autoClear, false);
    this.preExecute = options.preExecute;

    this.show = true;
    this.commandToExecute = undefined;
    this.clearCommand = undefined;
    if (this.autoClear) {
      this.clearCommand = new despCore.ClearCommand({
        color: new despCore.Color(0.0, 0.0, 0.0, 0.0),
        depth: 1.0,
        framebuffer: this.framebuffer,
        pass: despCore.Pass.OPAQUE
      });
    }
  }

  createCommand (context) {
    switch (this.commandType) {
      case "Draw": {
        let vertexArray = despCore.VertexArray.fromGeometry({
          context: context,
          geometry: this.geometry,
          attributeLocations: this.attributeLocations,
          bufferUsage: despCore.BufferUsage.STATIC_DRAW
        });

        let shaderProgram = despCore.ShaderProgram.fromCache({
          context: context,
          attributeLocations: this.attributeLocations,
          vertexShaderSource: this.vertexShaderSource,
          fragmentShaderSource: this.fragmentShaderSource
        });

        let renderState = despCore.RenderState.fromCache(this.rawRenderState);
        return new despCore.DrawCommand({
          owner: this,
          vertexArray: vertexArray,
          primitiveType: this.primitiveType,
          uniformMap: this.uniformMap,
          modelMatrix: despCore.Matrix4.IDENTITY,
          shaderProgram: shaderProgram,
          framebuffer: this.framebuffer,
          renderState: renderState,
          pass: despCore.Pass.OPAQUE
        });
      }
      case "Compute": {
        return new despCore.ComputeCommand({
          owner: this,
          fragmentShaderSource: this.fragmentShaderSource,
          uniformMap: this.uniformMap,
          outputTexture: this.outputTexture,
          persists: true
        });
      }
    }
  }

  setGeometry (context, geometry) {
    this.geometry = geometry;
    let vertexArray = despCore.VertexArray.fromGeometry({
      context: context,
      geometry: this.geometry,
      attributeLocations: this.attributeLocations,
      bufferUsage: despCore.BufferUsage.STATIC_DRAW
    });
    this.commandToExecute.vertexArray = vertexArray;
  }

  update (frameState) {
    if (!this.show) {
      return;
    }

    if (!despCore.defined(this.commandToExecute)) {
      this.commandToExecute = this.createCommand(frameState.context);
    }

    if (despCore.defined(this.preExecute)) {
      this.preExecute();
    }

    if (despCore.defined(this.clearCommand)) {
      frameState.commandList.push(this.clearCommand);
    }
    frameState.commandList.push(this.commandToExecute);
  }

  isDestroyed () {
    return false;
  }

  destroy () {
    if (despCore.defined(this.commandToExecute)) {
      this.commandToExecute.shaderProgram =
        this.commandToExecute.shaderProgram &&
        this.commandToExecute.shaderProgram.destroy();
    }
    return despCore.destroyObject(this);
  }
}
let Util = (function () {
  let loadText = function (filePath) {
    let request = new XMLHttpRequest();
    request.open("GET", filePath, false);
    request.send();
    return request.responseText;
  };

  let getFullscreenQuad = function () {
    let fullscreenQuad = new despCore.Geometry({
      attributes: new despCore.GeometryAttributes({
        position: new despCore.GeometryAttribute({
          componentDatatype: despCore.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          //  v3----v2
          //  |     |
          //  |     |
          //  v0----v1
          values: new Float32Array([
            -1,
            -1,
            0, // v0
            1,
            -1,
            0, // v1
            1,
            1,
            0, // v2
            -1,
            1,
            0 // v3
          ])
        }),
        st: new despCore.GeometryAttribute({
          componentDatatype: despCore.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
        })
      }),
      indices: new Uint32Array([3, 2, 0, 0, 2, 1])
    });
    return fullscreenQuad;
  };

  let createTexture = function (options, typedArray) {
    if (despCore.defined(typedArray)) {
      // typed array needs to be passed as source option, this is required by despCore.Texture
      let source = {};
      source.arrayBufferView = typedArray;
      options.source = source;
    }

    let texture = new despCore.Texture(options);
    return texture;
  };

  let createFramebuffer = function (context, colorTexture, depthTexture) {
    let framebuffer = new despCore.Framebuffer({
      context: context,
      colorTextures: [colorTexture],
      depthTexture: depthTexture
    });
    return framebuffer;
  };

  let createRawRenderState = function (options) {
    let translucent = true;
    let closed = false;
    let existing = {
      viewport: options.viewport,
      depthTest: options.depthTest,
      depthMask: options.depthMask,
      blending: options.blending
    };

    let rawRenderState = despCore.Appearance.getDefaultRenderState(
      translucent,
      closed,
      existing
    );
    return rawRenderState;
  };

  let viewRectangleToLonLatRange = function (viewRectangle) {
    let range = {};

    let postiveWest = despCore.Math.mod(
      viewRectangle.west,
      despCore.Math.TWO_PI
    );
    let postiveEast = despCore.Math.mod(
      viewRectangle.east,
      despCore.Math.TWO_PI
    );
    let width = viewRectangle.width;

    let longitudeMin;
    let longitudeMax;
    if (width > despCore.Math.THREE_PI_OVER_TWO) {
      longitudeMin = 0.0;
      longitudeMax = despCore.Math.TWO_PI;
    } else {
      if (postiveEast - postiveWest < width) {
        longitudeMin = postiveWest;
        longitudeMax = postiveWest + width;
      } else {
        longitudeMin = postiveWest;
        longitudeMax = postiveEast;
      }
    }

    range.lon = {
      min: despCore.Math.toDegrees(longitudeMin),
      max: despCore.Math.toDegrees(longitudeMax)
    };

    let south = viewRectangle.south;
    let north = viewRectangle.north;
    let height = viewRectangle.height;

    let extendHeight = height > despCore.Math.PI / 12 ? height / 2 : 0;
    let extendedSouth = despCore.Math.clampToLatitudeRange(
      south - extendHeight
    );
    let extendedNorth = despCore.Math.clampToLatitudeRange(
      north + extendHeight
    );

    // extend the bound in high latitude area to make sure it can cover all the visible area
    if (extendedSouth < -despCore.Math.PI_OVER_THREE) {
      extendedSouth = -despCore.Math.PI_OVER_TWO;
    }
    if (extendedNorth > despCore.Math.PI_OVER_THREE) {
      extendedNorth = despCore.Math.PI_OVER_TWO;
    }

    range.lat = {
      min: despCore.Math.toDegrees(extendedSouth),
      max: despCore.Math.toDegrees(extendedNorth)
    };

    return range;
  };

  return {
    loadText: loadText,
    getFullscreenQuad: getFullscreenQuad,
    createTexture: createTexture,
    createFramebuffer: createFramebuffer,
    createRawRenderState: createRawRenderState,
    viewRectangleToLonLatRange: viewRectangleToLonLatRange
  };
})();

let DataProcess = (function () {
  let data;
  let netcdfjs = require("netcdfjs");
  let loadNetCDF = function (filePath) {
    return new Promise(function (resolve) {
      let request = new XMLHttpRequest();
      request.open("GET", filePath);
      request.responseType = "arraybuffer";

      request.onload = function () {
        let arrayToMap = function (array) {
          return array.reduce(function (map, object) {
            map[object.name] = object;
            return map;
          }, {});
        };

        let NetCDF = new netcdfjs(request.response);
        data = {};

        let dimensions = arrayToMap(NetCDF.dimensions);
        data.dimensions = {};
        data.dimensions.lon = dimensions["lon"].size;
        data.dimensions.lat = dimensions["lat"].size;
        data.dimensions.lev = dimensions["lev"].size;

        let variables = arrayToMap(NetCDF.variables);
        let uAttributes = arrayToMap(variables["U"].attributes);
        let vAttributes = arrayToMap(variables["V"].attributes);

        data.lon = {};
        data.lon.array = new Float32Array(NetCDF.getDataVariable("lon").flat());
        data.lon.min = Math.min(...data.lon.array);
        data.lon.max = Math.max(...data.lon.array);

        data.lat = {};
        data.lat.array = new Float32Array(NetCDF.getDataVariable("lat").flat());
        data.lat.min = Math.min(...data.lat.array);
        data.lat.max = Math.max(...data.lat.array);

        data.lev = {};
        data.lev.array = new Float32Array(NetCDF.getDataVariable("lev").flat());
        data.lev.min = Math.min(...data.lev.array);
        data.lev.max = Math.max(...data.lev.array);

        data.U = {};
        data.U.array = new Float32Array(NetCDF.getDataVariable("U").flat());
        data.U.min = uAttributes["min"].value;
        data.U.max = uAttributes["max"].value;

        data.V = {};
        data.V.array = new Float32Array(NetCDF.getDataVariable("V").flat());
        data.V.min = vAttributes["min"].value;
        data.V.max = vAttributes["max"].value;

        resolve(data);
      };

      request.send();
    });
  };

  let loadColorTable = function (string) {
    // let string = Util.loadText(filePath);
    // let json = JSON.parse(string);

    let colorNum = string["ncolors"];
    let colorTable = string["colorTable"];

    let colorsArray = new Float32Array(3 * colorNum);
    for (let i = 0; i < colorNum; i++) {
      colorsArray[3 * i] = colorTable[3 * i];
      colorsArray[3 * i + 1] = colorTable[3 * i + 1];
      colorsArray[3 * i + 2] = colorTable[3 * i + 2];
    }

    data.colorTable = {};
    data.colorTable.colorNum = colorNum;
    data.colorTable.array = colorsArray;
  };

  let loadData = async function () {
    let ncFilePath0 = fileOptions.dataDirectory + fileOptions.dataFile;
    let ncFilePath = require("./../assets/data/demo.nc");
    await loadNetCDF(ncFilePath);

    let colorTableFilePath0 = fileOptions.dataDirectory + "colorTable.json";
    // let colorTableFilePath = require("./../assets/data/colorTable.json");
    loadColorTable(colorTable);

    return data;
  };

  let randomizeParticles = function (maxParticles, viewerParameters) {
    let array = new Float32Array(4 * maxParticles);
    for (let i = 0; i < maxParticles; i++) {
      array[4 * i] = despCore.Math.randomBetween(
        viewerParameters.lonRange.x,
        viewerParameters.lonRange.y
      );
      array[4 * i + 1] = despCore.Math.randomBetween(
        viewerParameters.latRange.x,
        viewerParameters.latRange.y
      );
      array[4 * i + 2] = despCore.Math.randomBetween(
        data.lev.min,
        data.lev.max
      );
      array[4 * i + 3] = 0.0;
    }
    return array;
  };

  return {
    loadData: loadData,
    randomizeParticles: randomizeParticles
  };
})();

class ParticlesComputing {
  constructor(context, data, userInput, viewerParameters) {
    this.createWindTextures(context, data);
    this.createParticlesTextures(context, userInput, viewerParameters);
    this.createComputingPrimitives(data, userInput, viewerParameters);
  }

  createWindTextures (context, data) {
    let windTextureOptions = {
      context: context,
      width: data.dimensions.lon,
      height: data.dimensions.lat * data.dimensions.lev,
      pixelFormat: despCore.PixelFormat.LUMINANCE,
      pixelDatatype: despCore.PixelDatatype.FLOAT,
      flipY: false,
      sampler: new despCore.Sampler({
        // the values of texture will not be interpolated
        minificationFilter: despCore.TextureMinificationFilter.NEAREST,
        magnificationFilter: despCore.TextureMagnificationFilter.NEAREST
      })
    };

    this.windTextures = {
      U: Util.createTexture(windTextureOptions, data.U.array),
      V: Util.createTexture(windTextureOptions, data.V.array)
    };
  }

  createParticlesTextures (context, userInput, viewerParameters) {
    let particlesTextureOptions = {
      context: context,
      width: userInput.particlesTextureSize,
      height: userInput.particlesTextureSize,
      pixelFormat: despCore.PixelFormat.RGBA,
      pixelDatatype: despCore.PixelDatatype.FLOAT,
      flipY: false,
      sampler: new despCore.Sampler({
        // the values of texture will not be interpolated
        minificationFilter: despCore.TextureMinificationFilter.NEAREST,
        magnificationFilter: despCore.TextureMagnificationFilter.NEAREST
      })
    };

    let particlesArray = DataProcess.randomizeParticles(
      userInput.maxParticles,
      viewerParameters
    );
    let zeroArray = new Float32Array(4 * userInput.maxParticles).fill(0);

    this.particlesTextures = {
      particlesWind: Util.createTexture(particlesTextureOptions),

      currentParticlesPosition: Util.createTexture(
        particlesTextureOptions,
        particlesArray
      ),
      nextParticlesPosition: Util.createTexture(
        particlesTextureOptions,
        particlesArray
      ),

      currentParticlesSpeed: Util.createTexture(
        particlesTextureOptions,
        zeroArray
      ),
      nextParticlesSpeed: Util.createTexture(
        particlesTextureOptions,
        zeroArray
      ),

      postProcessingPosition: Util.createTexture(
        particlesTextureOptions,
        particlesArray
      ),
      postProcessingSpeed: Util.createTexture(
        particlesTextureOptions,
        zeroArray
      )
    };
  }

  destroyParticlesTextures () {
    Object.keys(this.particlesTextures).forEach(key => {
      this.particlesTextures[key].destroy();
    });
  }

  createComputingPrimitives (data, userInput, viewerParameters) {
    const dimension = new despCore.Cartesian3(
      data.dimensions.lon,
      data.dimensions.lat,
      data.dimensions.lev
    );
    const minimum = new despCore.Cartesian3(
      data.lon.min,
      data.lat.min,
      data.lev.min
    );
    const maximum = new despCore.Cartesian3(
      data.lon.max,
      data.lat.max,
      data.lev.max
    );
    const interval = new despCore.Cartesian3(
      (maximum.x - minimum.x) / (dimension.x - 1),
      (maximum.y - minimum.y) / (dimension.y - 1),
      dimension.z > 1 ? (maximum.z - minimum.z) / (dimension.z - 1) : 1.0
    );
    const uSpeedRange = new despCore.Cartesian2(data.U.min, data.U.max);
    const vSpeedRange = new despCore.Cartesian2(data.V.min, data.V.max);

    const that = this;

    this.primitives = {
      getWind: new CustomPrimitive({
        commandType: "Compute",
        uniformMap: {
          U: function () {
            return that.windTextures.U;
          },
          V: function () {
            return that.windTextures.V;
          },
          currentParticlesPosition: function () {
            return that.particlesTextures.currentParticlesPosition;
          },
          dimension: function () {
            return dimension;
          },
          minimum: function () {
            return minimum;
          },
          maximum: function () {
            return maximum;
          },
          interval: function () {
            return interval;
          }
        },
        fragmentShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(getWindpath)]
        }),
        outputTexture: this.particlesTextures.particlesWind,
        preExecute: function () {
          // keep the outputTexture up to date
          that.primitives.getWind.commandToExecute.outputTexture =
            that.particlesTextures.particlesWind;
        }
      }),

      updateSpeed: new CustomPrimitive({
        commandType: "Compute",
        uniformMap: {
          currentParticlesSpeed: function () {
            return that.particlesTextures.currentParticlesSpeed;
          },
          particlesWind: function () {
            return that.particlesTextures.particlesWind;
          },
          uSpeedRange: function () {
            return uSpeedRange;
          },
          vSpeedRange: function () {
            return vSpeedRange;
          },
          pixelSize: function () {
            return viewerParameters.pixelSize;
          },
          speedFactor: function () {
            return userInput.speedFactor;
          }
        },
        fragmentShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(updatespeedpath)]
        }),
        outputTexture: this.particlesTextures.nextParticlesSpeed,
        preExecute: function () {
          // swap textures before binding
          let temp;
          temp = that.particlesTextures.currentParticlesSpeed;
          that.particlesTextures.currentParticlesSpeed =
            that.particlesTextures.postProcessingSpeed;
          that.particlesTextures.postProcessingSpeed = temp;

          // keep the outputTexture up to date
          that.primitives.updateSpeed.commandToExecute.outputTexture =
            that.particlesTextures.nextParticlesSpeed;
        }
      }),

      updatePosition: new CustomPrimitive({
        commandType: "Compute",
        uniformMap: {
          currentParticlesPosition: function () {
            return that.particlesTextures.currentParticlesPosition;
          },
          currentParticlesSpeed: function () {
            return that.particlesTextures.currentParticlesSpeed;
          }
        },
        fragmentShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(updatePositionpath)]
        }),
        outputTexture: this.particlesTextures.nextParticlesPosition,
        preExecute: function () {
          // swap textures before binding
          let temp;
          temp = that.particlesTextures.currentParticlesPosition;
          that.particlesTextures.currentParticlesPosition =
            that.particlesTextures.postProcessingPosition;
          that.particlesTextures.postProcessingPosition = temp;

          // keep the outputTexture up to date
          that.primitives.updatePosition.commandToExecute.outputTexture =
            that.particlesTextures.nextParticlesPosition;
        }
      }),

      postProcessingPosition: new CustomPrimitive({
        commandType: "Compute",
        uniformMap: {
          nextParticlesPosition: function () {
            return that.particlesTextures.nextParticlesPosition;
          },
          nextParticlesSpeed: function () {
            return that.particlesTextures.nextParticlesSpeed;
          },
          lonRange: function () {
            return viewerParameters.lonRange;
          },
          latRange: function () {
            return viewerParameters.latRange;
          },
          randomCoef: function () {
            let randomCoef = Math.random();
            return randomCoef;
          },
          dropRate: function () {
            return userInput.dropRate;
          },
          dropRateBump: function () {
            return userInput.dropRateBump;
          }
        },
        fragmentShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(postProcessingPositionpath)]
        }),
        outputTexture: this.particlesTextures.postProcessingPosition,
        preExecute: function () {
          // keep the outputTexture up to date
          that.primitives.postProcessingPosition.commandToExecute.outputTexture =
            that.particlesTextures.postProcessingPosition;
        }
      }),

      postProcessingSpeed: new CustomPrimitive({
        commandType: "Compute",
        uniformMap: {
          postProcessingPosition: function () {
            return that.particlesTextures.postProcessingPosition;
          },
          nextParticlesSpeed: function () {
            return that.particlesTextures.nextParticlesSpeed;
          }
        },
        fragmentShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(postProcessingSpeedpath)]
        }),
        outputTexture: this.particlesTextures.postProcessingSpeed,
        preExecute: function () {
          // keep the outputTexture up to date
          that.primitives.postProcessingSpeed.commandToExecute.outputTexture =
            that.particlesTextures.postProcessingSpeed;
        }
      })
    };
  }
}
class ParticlesRendering {
  constructor(context, data, userInput, viewerParameters, particlesComputing) {
    this.createRenderingTextures(context, data);
    this.createRenderingFramebuffers(context);
    this.createRenderingPrimitives(
      context,
      userInput,
      viewerParameters,
      particlesComputing
    );
  }

  createRenderingTextures (context, data) {
    const colorTextureOptions = {
      context: context,
      width: context.drawingBufferWidth,
      height: context.drawingBufferHeight,
      pixelFormat: despCore.PixelFormat.RGBA,
      pixelDatatype: despCore.PixelDatatype.UNSIGNED_BYTE
    };
    const depthTextureOptions = {
      context: context,
      width: context.drawingBufferWidth,
      height: context.drawingBufferHeight,
      pixelFormat: despCore.PixelFormat.DEPTH_COMPONENT,
      pixelDatatype: despCore.PixelDatatype.UNSIGNED_INT
    };
    const colorTableTextureOptions = {
      context: context,
      width: data.colorTable.colorNum,
      height: 1,
      pixelFormat: despCore.PixelFormat.RGB,
      pixelDatatype: despCore.PixelDatatype.FLOAT,
      sampler: new despCore.Sampler({
        minificationFilter: despCore.TextureMinificationFilter.LINEAR,
        magnificationFilter: despCore.TextureMagnificationFilter.LINEAR
      })
    };

    this.textures = {
      segmentsColor: Util.createTexture(colorTextureOptions),
      segmentsDepth: Util.createTexture(depthTextureOptions),

      currentTrailsColor: Util.createTexture(colorTextureOptions),
      currentTrailsDepth: Util.createTexture(depthTextureOptions),

      nextTrailsColor: Util.createTexture(colorTextureOptions),
      nextTrailsDepth: Util.createTexture(depthTextureOptions),

      colorTable: Util.createTexture(
        colorTableTextureOptions,
        data.colorTable.array
      )
    };
  }

  createRenderingFramebuffers (context) {
    this.framebuffers = {
      segments: Util.createFramebuffer(
        context,
        this.textures.segmentsColor,
        this.textures.segmentsDepth
      ),
      currentTrails: Util.createFramebuffer(
        context,
        this.textures.currentTrailsColor,
        this.textures.currentTrailsDepth
      ),
      nextTrails: Util.createFramebuffer(
        context,
        this.textures.nextTrailsColor,
        this.textures.nextTrailsDepth
      )
    };
  }

  createSegmentsGeometry (userInput) {
    const repeatVertex = 4;

    let st = [];
    for (let s = 0; s < userInput.particlesTextureSize; s++) {
      for (let t = 0; t < userInput.particlesTextureSize; t++) {
        for (let i = 0; i < repeatVertex; i++) {
          st.push(s / userInput.particlesTextureSize);
          st.push(t / userInput.particlesTextureSize);
        }
      }
    }
    st = new Float32Array(st);

    let normal = [];
    const pointToUse = [-1, 1];
    const offsetSign = [-1, 1];
    for (let i = 0; i < userInput.maxParticles; i++) {
      for (let j = 0; j < repeatVertex / 2; j++) {
        for (let k = 0; k < repeatVertex / 2; k++) {
          normal.push(pointToUse[j]);
          normal.push(offsetSign[k]);
          normal.push(0);
        }
      }
    }
    normal = new Float32Array(normal);

    const indexSize = 6 * userInput.maxParticles;
    let vertexIndexes = new Uint32Array(indexSize);
    for (let i = 0, j = 0, vertex = 0; i < userInput.maxParticles; i++) {
      vertexIndexes[j++] = vertex + 0;
      vertexIndexes[j++] = vertex + 1;
      vertexIndexes[j++] = vertex + 2;
      vertexIndexes[j++] = vertex + 2;
      vertexIndexes[j++] = vertex + 1;
      vertexIndexes[j++] = vertex + 3;
      vertex += 4;
    }

    let geometry = new despCore.Geometry({
      attributes: new despCore.GeometryAttributes({
        st: new despCore.GeometryAttribute({
          componentDatatype: despCore.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: st
        }),
        normal: new despCore.GeometryAttribute({
          componentDatatype: despCore.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: normal
        })
      }),
      indices: vertexIndexes
    });

    return geometry;
  }

  createRenderingPrimitives (
    context,
    userInput,
    viewerParameters,
    particlesComputing
  ) {
    const that = this;
    this.primitives = {
      segments: new CustomPrimitive({
        commandType: "Draw",
        attributeLocations: {
          st: 0,
          normal: 1
        },
        geometry: this.createSegmentsGeometry(userInput),
        primitiveType: despCore.PrimitiveType.TRIANGLES,
        uniformMap: {
          currentParticlesPosition: function () {
            return particlesComputing.particlesTextures
              .currentParticlesPosition;
          },
          postProcessingPosition: function () {
            return particlesComputing.particlesTextures.postProcessingPosition;
          },
          postProcessingSpeed: function () {
            return particlesComputing.particlesTextures.postProcessingSpeed;
          },
          colorTable: function () {
            return that.textures.colorTable;
          },
          aspect: function () {
            return context.drawingBufferWidth / context.drawingBufferHeight;
          },
          pixelSize: function () {
            return viewerParameters.pixelSize;
          },
          lineWidth: function () {
            return userInput.lineWidth;
          },
          particleHeight: function () {
            return userInput.particleHeight;
          }
        },
        vertexShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(segmentDrawvertpath)]
        }),
        fragmentShaderSource: new despCore.ShaderSource({
          sources: [Util.loadText(segmentDrawpath)]
        }),
        rawRenderState: Util.createRawRenderState({
          // undefined value means let despCore deal with it
          viewport: undefined,
          depthTest: {
            enabled: true
          },
          depthMask: true
        }),
        framebuffer: this.framebuffers.segments,
        autoClear: true
      }),

      trails: new CustomPrimitive({
        commandType: "Draw",
        attributeLocations: {
          position: 0,
          st: 1
        },
        geometry: Util.getFullscreenQuad(),
        primitiveType: despCore.PrimitiveType.TRIANGLES,
        uniformMap: {
          segmentsColorTexture: function () {
            return that.textures.segmentsColor;
          },
          segmentsDepthTexture: function () {
            return that.textures.segmentsDepth;
          },
          currentTrailsColor: function () {
            return that.framebuffers.currentTrails.getColorTexture(0);
          },
          trailsDepthTexture: function () {
            return that.framebuffers.currentTrails.depthTexture;
          },
          fadeOpacity: function () {
            return userInput.fadeOpacity;
          }
        },
        // prevent despCore from writing depth because the depth here should be written manually
        vertexShaderSource: new despCore.ShaderSource({
          defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
          sources: [Util.loadText(fullscreenpath)]
        }),
        fragmentShaderSource: new despCore.ShaderSource({
          defines: ["DISABLE_LOG_DEPTH_FRAGMENT_WRITE"],
          sources: [Util.loadText(trailDrawpath)]
        }),
        rawRenderState: Util.createRawRenderState({
          viewport: undefined,
          depthTest: {
            enabled: true,
            func: despCore.DepthFunction.ALWAYS // always pass depth test for full control of depth information
          },
          depthMask: true
        }),
        framebuffer: this.framebuffers.nextTrails,
        autoClear: true,
        preExecute: function () {
          // swap framebuffers before binding
          let temp;
          temp = that.framebuffers.currentTrails;
          that.framebuffers.currentTrails = that.framebuffers.nextTrails;
          that.framebuffers.nextTrails = temp;

          // keep the framebuffers up to date
          that.primitives.trails.commandToExecute.framebuffer =
            that.framebuffers.nextTrails;
          that.primitives.trails.clearCommand.framebuffer =
            that.framebuffers.nextTrails;
        }
      }),

      screen: new CustomPrimitive({
        commandType: "Draw",
        attributeLocations: {
          position: 0,
          st: 1
        },
        geometry: Util.getFullscreenQuad(),
        primitiveType: despCore.PrimitiveType.TRIANGLES,
        uniformMap: {
          trailsColorTexture: function () {
            return that.framebuffers.nextTrails.getColorTexture(0);
          },
          trailsDepthTexture: function () {
            return that.framebuffers.nextTrails.depthTexture;
          }
        },
        // prevent despCore from writing depth because the depth here should be written manually
        vertexShaderSource: new despCore.ShaderSource({
          defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
          sources: [Util.loadText(fullscreenpath)]
        }),
        fragmentShaderSource: new despCore.ShaderSource({
          defines: ["DISABLE_LOG_DEPTH_FRAGMENT_WRITE"],
          sources: [Util.loadText(screenDrawpath)]
        }),
        rawRenderState: Util.createRawRenderState({
          viewport: undefined,
          depthTest: {
            enabled: false
          },
          depthMask: true,
          blending: {
            enabled: true
          }
        }),
        framebuffer: undefined // undefined value means let despCore deal with it
      })
    };
  }
}

class ParticleSystem {
  constructor(context, data, userInput, viewerParameters) {
    this.context = context;
    this.data = data;
    this.userInput = userInput;
    this.viewerParameters = viewerParameters;

    this.particlesComputing = new ParticlesComputing(
      this.context,
      this.data,
      this.userInput,
      this.viewerParameters
    );
    this.particlesRendering = new ParticlesRendering(
      this.context,
      this.data,
      this.userInput,
      this.viewerParameters,
      this.particlesComputing
    );
  }

  canvasResize (context) {
    this.particlesComputing.destroyParticlesTextures();
    Object.keys(this.particlesComputing.windTextures).forEach(key => {
      this.particlesComputing.windTextures[key].destroy();
    });

    this.particlesRendering.textures.colorTable.destroy();
    Object.keys(this.particlesRendering.framebuffers).forEach(key => {
      this.particlesRendering.framebuffers[key].destroy();
    });

    this.context = context;
    this.particlesComputing = new ParticlesComputing(
      this.context,
      this.data,
      this.userInput,
      this.viewerParameters
    );
    this.particlesRendering = new ParticlesRendering(
      this.context,
      this.data,
      this.userInput,
      this.viewerParameters,
      this.particlesComputing
    );
  }

  clearFramebuffers () {
    let clearCommand = new despCore.ClearCommand({
      color: new despCore.Color(0.0, 0.0, 0.0, 0.0),
      depth: 1.0,
      framebuffer: undefined,
      pass: despCore.Pass.OPAQUE
    });

    Object.keys(this.particlesRendering.framebuffers).forEach(key => {
      clearCommand.framebuffer = this.particlesRendering.framebuffers[key];
      clearCommand.execute(this.context);
    });
  }

  refreshParticles (maxParticlesChanged) {
    this.clearFramebuffers();

    this.particlesComputing.destroyParticlesTextures();
    this.particlesComputing.createParticlesTextures(
      this.context,
      this.userInput,
      this.viewerParameters
    );

    if (maxParticlesChanged) {
      let geometry = this.particlesRendering.createSegmentsGeometry(
        this.userInput
      );
      this.particlesRendering.primitives.segments.geometry = geometry;
      let vertexArray = despCore.VertexArray.fromGeometry({
        context: this.context,
        geometry: geometry,
        attributeLocations: this.particlesRendering.primitives.segments
          .attributeLocations,
        bufferUsage: despCore.BufferUsage.STATIC_DRAW
      });
      this.particlesRendering.primitives.segments.commandToExecute.vertexArray = vertexArray;
    }
  }

  applyUserInput (userInput) {
    let maxParticlesChanged = false;
    if (this.userInput.maxParticles != userInput.maxParticles) {
      maxParticlesChanged = true;
    }

    Object.keys(userInput).forEach(key => {
      this.userInput[key] = userInput[key];
    });
    this.refreshParticles(maxParticlesChanged);
  }

  applyViewerParameters (viewerParameters) {
    Object.keys(viewerParameters).forEach(key => {
      this.viewerParameters[key] = viewerParameters[key];
    });
    this.refreshParticles(false);
  }
}

export class Wind3D {
  constructor(panel, viewer) {
    this.viewer = viewer;
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera;

    this.panel = panel;

    this.viewerParameters = {
      lonRange: new despCore.Cartesian2(),
      latRange: new despCore.Cartesian2(),
      pixelSize: 0.0
    };
    // use a smaller earth radius to make sure distance to camera > 0
    this.globeBoundingSphere = new despCore.BoundingSphere(
      despCore.Cartesian3.ZERO,
      0.99 * 6378137.0
    );
    this.updateViewerParameters();

    DataProcess.loadData().then(data => {
      this.particleSystem = new ParticleSystem(
        this.scene.context,
        data,
        this.panel.getUserInput(),
        this.viewerParameters
      );
      this.addPrimitives();

      this.setupEventListeners();

      // if (mode.debug) {
      //   this.debug();
      // }
    });

    this.imageryLayers = this.viewer.imageryLayers;
    this.setGlobeLayer(this.panel.getUserInput());
  }

  addPrimitives () {
    // the order of primitives.add() should respect the dependency of primitives
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.getWind
    );
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.updateSpeed
    );
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.updatePosition
    );
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.postProcessingPosition
    );
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.postProcessingSpeed
    );

    this.scene.primitives.add(
      this.particleSystem.particlesRendering.primitives.segments
    );
    this.scene.primitives.add(
      this.particleSystem.particlesRendering.primitives.trails
    );
    this.scene.primitives.add(
      this.particleSystem.particlesRendering.primitives.screen
    );
  }

  updateViewerParameters () {
    var viewRectangle = this.camera.computeViewRectangle(
      this.scene.globe.ellipsoid
    );
    var lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
    this.viewerParameters.lonRange.x = lonLatRange.lon.min;
    this.viewerParameters.lonRange.y = lonLatRange.lon.max;
    this.viewerParameters.latRange.x = lonLatRange.lat.min;
    this.viewerParameters.latRange.y = lonLatRange.lat.max;

    var pixelSize = this.camera.getPixelSize(
      this.globeBoundingSphere,
      this.scene.drawingBufferWidth,
      this.scene.drawingBufferHeight
    );

    if (pixelSize > 0) {
      this.viewerParameters.pixelSize = pixelSize;
    }
  }

  setGlobeLayer (userInput) {
    this.viewer.imageryLayers.removeAll();
    this.viewer.terrainProvider = new despCore.EllipsoidTerrainProvider();

    var globeLayer = userInput.globeLayer;
    switch (globeLayer.type) {
      case "NaturalEarthII": {
        this.viewer.imageryLayers.addImageryProvider(
          new despCore.TileMapServiceImageryProvider({
            url: despCore.buildModuleUrl("Assets/Textures/NaturalEarthII")
          })
        );
        break;
      }
      case "WMS": {
        this.viewer.imageryLayers.addImageryProvider(
          new despCore.WebMapServiceImageryProvider({
            url: userInput.WMS_URL,
            layers: globeLayer.layer,
            parameters: {
              ColorScaleRange: globeLayer.ColorScaleRange
            }
          })
        );
        break;
      }
      case "WorldTerrain": {
        this.viewer.imageryLayers.addImageryProvider(
          despCore.createWorldImagery()
        );
        this.viewer.terrainProvider = despCore.createWorldTerrain();
        break;
      }
    }
  }

  setupEventListeners () {
    const that = this;

    this.camera.moveStart.addEventListener(function () {
      that.scene.primitives.show = false;
    });

    this.camera.moveEnd.addEventListener(function () {
      that.updateViewerParameters();
      that.particleSystem.applyViewerParameters(that.viewerParameters);
      that.scene.primitives.show = true;
    });

    var resized = false;
    window.addEventListener("resize", function () {
      resized = true;
      that.scene.primitives.show = false;
      that.scene.primitives.removeAll();
    });

    this.scene.preRender.addEventListener(function () {
      if (resized) {
        that.particleSystem.canvasResize(that.scene.context);
        resized = false;
        that.addPrimitives();
        that.scene.primitives.show = true;
      }
    });

    window.addEventListener("particleSystemOptionsChanged", function () {
      that.particleSystem.applyUserInput(that.panel.getUserInput());
    });
    window.addEventListener("layerOptionsChanged", function () {
      that.setGlobeLayer(that.panel.getUserInput());
    });
  }

  debug () {
    const that = this;

    var animate = function () {
      that.viewer.resize();
      that.viewer.render();
      requestAnimationFrame(animate);
    };

    var spector = new SPECTOR.Spector();
    spector.displayUI();
    spector.spyCanvases();

    animate();
  }
}
