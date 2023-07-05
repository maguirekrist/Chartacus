
import { IRender } from "../renderer";
import { webglUtils } from "../utils/webglUtils";
import { canvas } from "../utils/globals";
import { Object2D } from "../model/object2D";


// export class ObjectRenderer implements IRender<Object2D> { 
//     gl: WebGL2RenderingContext;
//     program: WebGLProgram;
//     positionAttributeLocation: number;

//     modelLoc: WebGLUniformLocation;
//     projectionLoc: WebGLUniformLocation;
//     viewLoc: WebGLUniformLocation;
//     resolutionLoc: WebGLUniformLocation;

//     vao: WebGLVertexArrayObject;

//     constructor(gl: WebGL2RenderingContext) {
//         this.gl = gl;
//         this.program = webglUtils.createProgramFromSources(this.gl, [vertexShaderSource, fragmentShaderSource])  

//         this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
//         this.modelLoc = this.gl.getUniformLocation(this.program, "model");
//         this.viewLoc = this.gl.getUniformLocation(this.program, "view");
//         this.projectionLoc = this.gl.getUniformLocation(this.program, "projection");
//         this.resolutionLoc = this.gl.getUniformLocation(this.program, "u_resolution");
//     }

//     render(element: Object2D): void {
//         this.gl.useProgram(this.program);

//         var positionBuffer = this.gl.createBuffer();
//         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);     
//         this.gl.bufferData(this.gl.ARRAY_BUFFER, element.geometry.attribute.vertices, this.gl.STATIC_DRAW);

//         this.vao = this.gl.createVertexArray();
//         this.gl.bindVertexArray(this.vao);
//         this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
//         this.gl.vertexAttribPointer(
//             this.positionAttributeLocation, element.geometry.attribute.size, element.geometry.attribute.type, element.geometry.attribute.normalize, element.geometry.attribute.stride ?? 0, element.geometry.attribute.offset ?? 0);

//         this.gl.bindVertexArray(this.vao);

//         this.gl.uniform2fv(this.resolutionLoc, [canvas.getCanvas().clientWidth, canvas.getCanvas().clientHeight]);
//         this.gl.uniformMatrix4fv(this.modelLoc, false, element.matrix); //4x4 matrix
//         this.gl.uniformMatrix4fv(this.viewLoc, false, canvas.getView());
//         this.gl.uniformMatrix4fv(this.projectionLoc, false, canvas.getProjection());

//         var primitiveType = this.gl.TRIANGLES;
//         var offset = 0;

//         //console.log(`Rendering point at ${element.x} ${element.y}`)
//         this.gl.drawArrays(primitiveType, offset, element.geometry.count);
//     }

// }