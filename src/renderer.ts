import { Grid } from "./model/data";
import { Line } from "./model/line";
import { Object2D } from "./model/object2D";
import { Point } from "./model/point";
import { Text } from "./model/text";
import { GridRenderer } from "./renderers/grid-renderer";
import { LineRenderer } from "./renderers/line-renderer";
import { PointRenderer } from "./renderers/point-renderer";
import { TextRenderer } from "./renderers/text-renderer";

export interface RendererVistor {
    drawPoint(point: Point) : void;
    drawGrid(grid: Grid): void;
    drawLine(line: Line): void;
    drawText(text: Text): void;
}

export interface IDrawable {
    accept(visitor: RendererVistor): void;
}

export interface IRender<T extends IDrawable> {
    render(element: T) : void;
}

export class Renderer implements RendererVistor {
    pointRenderer: PointRenderer;
    gridRenderer: GridRenderer;
    lineRenderer: LineRenderer;
    textRenderer: TextRenderer;

    constructor(gl: WebGL2RenderingContext) {
        this.pointRenderer = new PointRenderer(gl);
        this.gridRenderer = new GridRenderer(gl);
        this.lineRenderer = new LineRenderer(gl);
        this.textRenderer = new TextRenderer(gl);
    }

    drawText(text: Text): void {
        this.textRenderer.render(text);
    }

    drawPoint(point: Point): void {
        this.pointRenderer.render(point);
    }

    drawGrid(grid: Grid): void {
        this.gridRenderer.render(grid);
    }

    drawLine(line: Line): void {
        this.lineRenderer.render(line);
    }

}