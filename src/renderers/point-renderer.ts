import { mat4, vec3 } from "gl-matrix";
import { IRender } from "../renderer";
import { fragmentShaderSource, vertexShaderSource } from "../shaders/point";
import { webglUtils } from "../utils/webglUtils";
import { canvas } from "../utils/globals";
import { Point } from "../model/point";


export class PointRenderer implements IRender<Point> { 
    quadPoints = [
        0,0,
        0, -1,
        1, 0,
        1, 0,
        0,-1,
        1,-1
    ]; 

    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    positionAttributeLocation: number;
    colorLoc: WebGLUniformLocation;
    strokeColorLoc: WebGLUniformLocation;
    modelLoc: WebGLUniformLocation;
    projectionLoc: WebGLUniformLocation;
    viewLoc: WebGLUniformLocation;
    resolutionLoc: WebGLUniformLocation;
    sizeLoc: WebGLUniformLocation;

    vao: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.program = webglUtils.createProgramFromSources(this.gl, [vertexShaderSource, fragmentShaderSource])  

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.colorLoc = this.gl.getUniformLocation(this.program, "color");
        this.strokeColorLoc = this.gl.getUniformLocation(this.program, "strokeColor");
        this.modelLoc = this.gl.getUniformLocation(this.program, "model");
        this.viewLoc = this.gl.getUniformLocation(this.program, "view");
        this.sizeLoc = this.gl.getUniformLocation(this.program, "size");
        this.projectionLoc = this.gl.getUniformLocation(this.program, "projection");
        this.resolutionLoc = this.gl.getUniformLocation(this.program, "u_resolution");
    }

    render(element: Point): void {
        this.gl.useProgram(this.program);

        var positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);     
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

        this.gl.bindVertexArray(this.vao);

        this.gl.uniform2fv(this.resolutionLoc, [canvas.getCanvas().clientWidth, canvas.getCanvas().clientHeight]);

        this.gl.uniform4fv(this.colorLoc, element.getColorAsArray());
        this.gl.uniform4fv(this.strokeColorLoc, element.getColorAsArray());
        this.gl.uniform1f(this.sizeLoc, element.scale);

        this.gl.uniformMatrix4fv(this.modelLoc, false, element.matrix); //4x4 matrix
        this.gl.uniformMatrix4fv(this.viewLoc, false, canvas.getView());
        this.gl.uniformMatrix4fv(this.projectionLoc, false, canvas.getProjection());
        //gl.uniformMatrix4fv(projectionLoc, false, projectionMatrix);

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 6;

        //console.log(`Rendering point at ${element.x} ${element.y}`)
        this.gl.drawArrays(primitiveType, offset, count);
    }

}