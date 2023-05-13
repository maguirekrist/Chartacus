import { Point } from "./model/Data";
import { PointRenderer } from "./renderers/PointRenderer";

export interface RendererVistor {
    draw(point: Point) : void;
}

export interface IDrawable {
    accept(visitor: RendererVistor): void;
}

export interface IRender<T> {
    render(element: T) : void;
}

export class Renderer implements RendererVistor {
    pointRenderer: PointRenderer

    constructor(gl: WebGL2RenderingContext) {
        this.pointRenderer = new PointRenderer(gl);
    }

    draw(point: Point): void {
        this.pointRenderer.render(point);
    }
}