import { mat4, vec3 } from "gl-matrix";
import { IRender } from "../renderer";
import { Point } from "../model/data";
import { fragmentShaderSource, vertexShaderSource } from "../shaders/basic";
import { webglUtils } from "../utils/webglUtils";
import { canvas } from "../utils/globals";


export class PointRenderer implements IRender<Point> { 
    quadPoints = [
        0,0,
        0, 1,
        1, 0,
        1, 0,
        0,1,
        1,1
    ]; 

    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    positionAttributeLocation: number;
    colorLoc: WebGLUniformLocation;
    modelLoc: WebGLUniformLocation;
    viewLoc: WebGLUniformLocation;
    resolutionLoc: WebGLUniformLocation;

    vao: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.program = webglUtils.createProgramFromSources(this.gl, [vertexShaderSource, fragmentShaderSource])
        var positionBuffer = this.gl.createBuffer();
        gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);       

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.colorLoc = this.gl.getUniformLocation(this.program, "color");
        this.modelLoc = this.gl.getUniformLocation(this.program, "model");
        this.viewLoc = this.gl.getUniformLocation(this.program, "view");
        this.resolutionLoc = this.gl.getUniformLocation(this.program, "u_resolution");

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.quadPoints), gl.STATIC_DRAW);
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset);

        // this.gl.bindBuffer(gl.ARRAY_BUFFER, 0);
        // tbis.gl.bindVertexArray(0);
    }

    render(element: Point): void {
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);

        this.gl.uniform2fv(this.resolutionLoc, [canvas.getCanvas().clientWidth, canvas.getCanvas().clientHeight]);

        this.gl.uniform4fv(this.colorLoc, [1.0, 0.5, 0.5, 1.0]);

        const vec3Scale = vec3.create();
        vec3.set(vec3Scale, 0.15, 0.15, 0);

        const vec3trans = vec3.create();
        vec3.set(vec3trans, element.x, element.y, 0);

        const mat = mat4.create();
        mat4.identity(mat);

        mat4.scale(mat, mat, vec3Scale);
        mat4.translate(mat, mat, vec3trans);

        this.gl.uniformMatrix4fv(this.modelLoc, false, mat); //4x4 matrix
        this.gl.uniformMatrix4fv(this.viewLoc, false, canvas.getView());
        //gl.uniformMatrix4fv(projectionLoc, false, projectionMatrix);

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 6;

        //console.log(`Rendering point at ${element.x} ${element.y}`)
        this.gl.drawArrays(primitiveType, offset, count);
    }

}