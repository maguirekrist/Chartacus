import { Grid } from "../model/data";
import { IRender } from "../renderer";
import { f_backgroundShaderSource, v_backgroundShaderSource } from "../shaders/background";
import { canvas } from "../utils/globals";
import { webglUtils } from "../utils/webglUtils";


export class GridRenderer implements IRender<Grid> {
    quadPoints = [
        -1,-1,
        -1, 1,
        1, -1,
        1, 1,
        -1,1,
        1,-1
    ];

    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    positionAttributeLocation: number;
    projectionLoc: WebGLUniformLocation;
    viewLoc: WebGLUniformLocation;
    resolutionLoc: WebGLUniformLocation;

    vao: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.program = webglUtils.createProgramFromSources(this.gl, [v_backgroundShaderSource, f_backgroundShaderSource])
        var positionBuffer = this.gl.createBuffer();
        gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);  

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.viewLoc = this.gl.getUniformLocation(this.program, "view");
        this.projectionLoc = this.gl.getUniformLocation(this.program, "projection");
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
    }

    render(element: Grid): void {
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);

        this.gl.uniform2fv(this.resolutionLoc, [canvas.getCanvas().clientWidth, canvas.getCanvas().clientHeight]);

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