import { mat4, vec3, vec4 } from "gl-matrix";
import { IDrawable, Renderer, RendererVistor } from "./Renderer";
import { Point } from "./model/Data";

document.addEventListener('DOMContentLoaded', () => {
    main();
});

function main() {
    var gl = canvas.getContext("webgl2");
    if(!gl)
    {
        var element = document.createElement("div");
        element.textContent = "Unable to load webgl2 context";
        document.body.appendChild(element);
    } else {

        const renderer = new Renderer(gl);

        var points: Point[] = [
            new Point(0, -1),
            new Point(0.5, 0.5),
            // new Point(0.9, 0.8)
        ];

        const render = (time: number) => {
            time *= 0.001;
        
            canvasHelper.resizeCanvasToDisplay(canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            const clearColor: Color = { 
                r: 1, 
                g: 1,
                b: 0.9,
                a: 1
            }

            gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
            gl.clear(gl.COLOR_BUFFER_BIT);

            drawAllDrawables(points, renderer);

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    } 

}
function drawAllDrawables(elements: IDrawable[], renderer: RendererVistor) {
    for(let elem of elements) {
        elem.accept(renderer);
    }
}
