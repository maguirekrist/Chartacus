import { mat4, vec3, vec4 } from "gl-matrix";
import { Candle } from "../model/candle";
import { IRender } from "../core/renderer";
import { f_candleShaderSource, v_candleShaderSource } from "../shaders/candle";
import { webglUtils } from "../utils/webglUtils";
import { Canvas } from "../core/canvas";


export class CandleRenderer implements IRender<Candle> {
    quadPoints = [
        0,0,
        0, 1,
        1, 0,
        1, 0,
        0,1,
        1,1
    ]; 

    gl: WebGL2RenderingContext;
    canvas: Canvas;
    program: WebGLProgram;
    positionAttributeLocation: number;
    colorLoc: WebGLUniformLocation;
    modelLoc: WebGLUniformLocation;
    projectionLoc: WebGLUniformLocation;
    viewLoc: WebGLUniformLocation;
    resolutionLoc: WebGLUniformLocation;
    candleDataLoc: WebGLUniformLocation;

    vao: WebGLVertexArrayObject;

    constructor(canvas: Canvas) {
        this.gl = canvas.getGlContext();
        this.canvas = canvas;
        this.program = webglUtils.createProgramFromSources(this.gl, [v_candleShaderSource, f_candleShaderSource])
        var positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);       

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.colorLoc = this.gl.getUniformLocation(this.program, "color");
        this.modelLoc = this.gl.getUniformLocation(this.program, "model");
        this.viewLoc = this.gl.getUniformLocation(this.program, "view");
        this.projectionLoc = this.gl.getUniformLocation(this.program, "projection");
        this.resolutionLoc = this.gl.getUniformLocation(this.program, "u_resolution");
        this.candleDataLoc = this.gl.getUniformLocation(this.program, "u_candleData");

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.quadPoints), this.gl.STATIC_DRAW);
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset);

        // this.gl.bindBuffer(gl.ARRAY_BUFFER, 0);
        // tbis.gl.bindVertexArray(0);
    }

    render(element: Candle): void {
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);


        this.gl.uniform2fv(this.resolutionLoc, [this.canvas.getCanvas().clientWidth, this.canvas.getCanvas().clientHeight]);

        this.gl.uniform4fv(this.colorLoc, element.getColorAsArray());

        const candleData = vec4.create();
        vec4.set(candleData, element.trade.high, element.trade.open, element.trade.close, element.trade.low);

        this.gl.uniformMatrix4fv(this.modelLoc, false, element.modelMat); //4x4 matrix
        this.gl.uniformMatrix4fv(this.viewLoc, false, this.canvas.getView());
        this.gl.uniformMatrix4fv(this.projectionLoc, false, this.canvas.getProjection());
        this.gl.uniform4fv(this.candleDataLoc, candleData);
        //gl.uniformMatrix4fv(projectionLoc, false, projectionMatrix);

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 6;

        //console.log(`Rendering point at ${element.x} ${element.y}`)
        this.gl.drawArrays(primitiveType, offset, count);
    }
}