import { IDrawable, Renderer, RendererVistor } from "./renderer";
import { Color, Grid, Point } from "./model/data";
import { canvas } from "./utils/globals";
import { Candle } from "./model/candle";


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
    var gl = canvas.getCanvas().getContext("webgl2", { antialias: true });
    if(!gl)
    {
        console.log("failed to load openGL");
        var element = document.createElement("div");
        element.textContent = "Unable to load webgl2 context";
        document.body.appendChild(element);
    } else {
        let [xNode, yNode, zoomNode] = initializeText();
        const renderer = new Renderer(gl);

        var points: Point[] = GenerateRandomPoints(10);
        var originPoint: Point = new Point(0, 0, { r: 1, g: 0, b: 0.0 });
        //var grid: Grid = new Grid(1.0);

        var testCandle: Candle = new Candle(3, 3, { high: 300, open: 60, close: 80, low: 10 });

        var renderables: IDrawable[] = [...points, originPoint, testCandle];

        canvas.initializeObjectMap([...points, originPoint, testCandle]);

        const render = (time: number) => {
            time *= 0.001;
    
            canvas.resizeCanvasToDisplay();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            updateText(xNode, yNode, zoomNode);

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

function initializeText() : [Text, Text, Text] {
    // look up the elements we want to affect
    var xElement = document.querySelector("#x-coord");
    var yElement = document.querySelector("#y-coord");
    var zoomElement = document.querySelector("#zoom");
    
    // Create text nodes to save some time for the browser
    // and avoid allocations.
    var xNode = document.createTextNode("");
    var yNode = document.createTextNode("");
    var zoomNode = document.createTextNode("");
    
    // Add those text nodes where they need to go
    xElement.appendChild(xNode);
    yElement.appendChild(yNode);
    zoomElement.appendChild(zoomNode);

    return [xNode, yNode, zoomNode];
}

function updateText(x: Text, y: Text, zoom: Text) {
    x.nodeValue = canvas.camPos[0].toFixed(2);
    y.nodeValue = canvas.camPos[1].toFixed(2);
    zoom.nodeValue = canvas.zoom.toString();
}

function drawAllDrawables(elements: IDrawable[], renderer: RendererVistor) {
    for(let elem of elements) {
        elem.accept(renderer);
    }
}

main();