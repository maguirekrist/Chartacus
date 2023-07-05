import { IDrawable, Renderer, RendererVistor } from "./renderer";
import { Color, Grid } from "./model/data";
import { canvas } from "./utils/globals";
import { Text as TextObj } from './model/text'
import { Font, load } from "opentype.js";
import { Point } from "./model/point";

document.addEventListener('DOMContentLoaded', async () => {
    var font = await loadFont();
    main(font);
});

function GenerateRandomPoints(amt: number) : Point[] {
    let points: Point[] = [];

    const getRandomPoint = (): Point => {
        return new Point(
            Math.floor(Math.random() * 500),
            Math.floor(Math.random() * 500),
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

function main(font: Font) {
    var gl = canvas.getCanvas().getContext("webgl2", { antialias: true });
    if(!gl)
    {
        var element = document.createElement("div");
        element.textContent = "Unable to load webgl2 context";
        document.body.appendChild(element);
    } else {
        const renderer = new Renderer(gl);

        var points: Point[] = GenerateRandomPoints(10);
        var originPoint: Point = new Point(-40, -40, { r: 1, g: 0, b: 0.0 });
        //var grid: Grid = new Grid(1.0);
        
        var testText = new TextObj("Hello world!", font, { x: 50, y: 50 });

        var renderables: IDrawable[] = [testText, ...points, originPoint];
        
        canvas.setSceneObjects([originPoint, testText, ...points])

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

async function loadFont(): Promise<Font> {
    var font = await load("https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf");
    return font;
}