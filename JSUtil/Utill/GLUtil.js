/**
 * @Author DY
 */
import Check from "./Check.js";
import ObjectUtil from "./ObjectUtil.js";

/**
 * @class GLUtil
 * @classdesc 操作webGLRender的工具类
 */
export default class GLUtil {

    static createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);

        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    static deleteShader(gl, shader) {
        gl.deleteShader(shader);
    }

    static createProgram(gl, vertexSource, fragmentSource) {
        const program = gl.createProgram();

        const vertexShader = GLUtil.createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = GLUtil.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }

        const wrapper = {program: program};

        wrapper.vertexShader = vertexShader;
        wrapper.fragmentShader = fragmentShader;

        const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttributes; i++) {
            const attribute = gl.getActiveAttrib(program, i);
            wrapper[attribute.name] = gl.getAttribLocation(program, attribute.name);
        }
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const uniform = gl.getActiveUniform(program, i);
            wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name);
        }

        return wrapper;
    }

    static deleteProgram(gl, wrapper) {
        gl.deleteProgram(wrapper.program);
        GLUtil.deleteShader(gl, wrapper.vertexShader);
        GLUtil.deleteShader(gl, wrapper.fragmentShader);
        ObjectUtil.deleteComplete(wrapper);
    }

    static createTexture(gl, filter, data, width, height) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        if (data instanceof Uint8Array) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    static deleteTexture(gl, texture) {
        gl.deleteTexture(texture);
    }

    static bindTexture(gl, texture, unit) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    static createVAO(gl, context, vaAttributes, indexBuffer) {
        const vao = context.glCreateVertexArray();
        context.glBindVertexArray(vao);

        for (let i = 0; i < vaAttributes.length; ++i) {
            let attribute = vaAttributes[i];
            let index = attribute.index;
            gl.bindBuffer(gl.ARRAY_BUFFER, attribute.vertexBuffer._getBuffer());
            gl.vertexAttribPointer(index, attribute.componentsPerAttribute, attribute.componentDatatype, attribute.normalize, attribute.strideInBytes, attribute.offsetInBytes);
            gl.enableVertexAttribArray(index);
        }

        if (defined(indexBuffer)) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer._getBuffer());
        }
        context.glBindVertexArray(null);
        return vao;
    }

    static createBuffer(gl, value, bufferTarget, usage) {
        bufferTarget = Check.checkDefined(bufferTarget) ? bufferTarget : gl.ARRAY_BUFFER;
        usage = Check.checkDefined(usage) ? usage : gl.STATIC_DRAW;
        const buffer = gl.createBuffer();
        gl.bindBuffer(bufferTarget, buffer);
        gl.bufferData(bufferTarget, value, usage);
        return buffer;
    }

    static deleteBuffer(gl, buffer) {
        gl.deleteBuffer(buffer);
    }

    static bindAttribute(gl, buffer, attribute, numComponents) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribute);
    }

    /**
     * 绑定
     * @param gl
     * @param framebuffer
     * @param texture
     * @param ext
     */
    static bindFramebuffer(gl, framebuffer, texture, ext) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        if (Check.Array(texture)) {
            if (ext) {
                const BufferArray = [];
                for (let i = 0; i < texture.length; i++) {
                    const target = ext[`COLOR_ATTACHMENT${i}_WEBGL`];
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, target, gl.TEXTURE_2D, texture[i], 0);
                    BufferArray.push(target);
                }
                ext.drawBuffersWEBGL(BufferArray);
            } else {
                console.log('Browser is not support WEBGL_draw_buffers yet!')
            }
        } else if (texture) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        }
    }

}
