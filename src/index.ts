import { IDrawable, Renderer, RendererVistor } from "./renderer";
import { Color, Grid, Point } from "./model/data";
import { canvas } from "./utils/globals";

document.addEventListener('DOMContentLoaded', () => {
    main();
});

function GenerateRandomPoints(amt: number) : Point[] {
    let points: Point[] = [];

    const getRandomPoint = (): Point => {
        return new Point(
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            {
                r: Math.random(),
                g: Math.random(),
                b: Math.random()
            }
        )
    }

    for(var i = 0; i < amt; i++) {
        points.push(getRandomPoint());
    }

    return points;
}

function main() {
    var gl = canvas.getCanvas().getContext("webgl2");
    if(!gl)
    {
        var element = document.createElement("div");
        element.textContent = "Unable to load webgl2 context";
        document.body.appendChild(element);
    } else {

        const renderer = new Renderer(gl);

        var points: Point[] = GenerateRandomPoints(10);
        var originPoint: Point = new Point(0, 0, { r: 1, g: 0, b: 0.0});
        var grid: Grid = new Grid(1.0);

        var renderables: IDrawable[] = [grid, ...points, originPoint];

        canvas.initializeObjectMap([...points, originPoint]);

        const render = (time: number) => {
            time *= 0.001;
    
            canvas.resizeCanvasToDisplay();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            const clearColor: Color = { 
                r: 1, 
                g: 1,
                b: 0.9,
                a: 1
            }

            gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
            gl.clear(gl.COLOR_BUFFER_BIT);

            drawAllDrawables(renderables, renderer);

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
