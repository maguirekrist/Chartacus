import { Grid, Point } from "./model/data";
import { GridRenderer } from "./renderers/grid-renderer";
import { PointRenderer } from "./renderers/point-renderer";

export interface RendererVistor {
    draw(point: Point) : void;
    drawGrid(grid: Grid): void;
}

export interface IDrawable {
    accept(visitor: RendererVistor): void;
}

export interface IRender<T> {
    render(element: T) : void;
}

export class Renderer implements RendererVistor {
    pointRenderer: PointRenderer
    gridRenderer: GridRenderer

    constructor(gl: WebGL2RenderingContext) {
        this.pointRenderer = new PointRenderer(gl);
        this.gridRenderer = new GridRenderer(gl);
    }

    draw(point: Point): void {
        this.pointRenderer.render(point);
    }

    drawGrid(grid: Grid): void {
        this.gridRenderer.render(grid);
    }
}