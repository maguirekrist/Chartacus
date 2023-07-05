import { mat4, vec3 } from "gl-matrix";
import { Text } from "../model/text";
import { IRender } from "../renderer";
import { f_textShaderSource, v_textShaderSource } from "../shaders/text";
import { canvas } from "../utils/globals";
import { webglUtils } from "../utils/webglUtils";


export class TextRenderer implements IRender<Text> {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;

    modelLoc: WebGLUniformLocation;
    projectionLoc: WebGLUniformLocation;
    viewLoc: WebGLUniformLocation;
    colorLoc: WebGLUniformLocation;
    
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.program = webglUtils.createProgramFromSources(this.gl, [v_textShaderSource, f_textShaderSource])        
        this.modelLoc = this.gl.getUniformLocation(this.program, "model");
        this.viewLoc = this.gl.getUniformLocation(this.program, "view");
        this.colorLoc = this.gl.getUniformLocation(this.program, "color");
        this.projectionLoc = this.gl.getUniformLocation(this.program, "projection");
    }

    render(element: Text): void {
        this.gl.useProgram(this.program);
        this.gl.bindAttribLocation(this.program, 0, "position");
        //const vec3Scale = vec3.create();
        //vec3.set(vec3Scale, element.width, element.height, 0); //this is our scale value, needs to be configurable I

        this.gl.uniform4fv(this.colorLoc, [1.0, 0.0, 0.0, 1.0]);

        this.gl.uniformMatrix4fv(this.modelLoc, false, element.matrix); //4x4 matrix
        this.gl.uniformMatrix4fv(this.viewLoc, false, canvas.getView());
        this.gl.uniformMatrix4fv(this.projectionLoc, false, canvas.getProjection());

        const vertBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, element.vertexData, this.gl.STATIC_DRAW);
        const indxBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indxBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, element.indexData, this.gl.STATIC_DRAW);


        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, true, 8, 0);
        
        this.gl.drawElements(this.gl.TRIANGLES, element.indices.length, this.gl.UNSIGNED_SHORT, 0);

        //this.gl.flush();
    }
}