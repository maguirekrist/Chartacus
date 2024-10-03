import { Candle } from "../model/candle";
import { Grid, Point } from "../model/data";
import { Line } from "../model/line";
import { CandleRenderer } from "../renderers/candle-renderer";
import { GridRenderer } from "../renderers/grid-renderer";
import { LineRenderer } from "../renderers/line-renderer";
import { PointRenderer } from "../renderers/point-renderer";
import { Canvas } from "./canvas";

export interface RendererVistor {
    draw(point: Point) : void;
    drawGrid(grid: Grid): void;
    drawLine(line: Line): void;
    drawCandle(candle: Candle): void;
}

export interface IDrawable {
    accept(visitor: RendererVistor): void;
}

export interface IRender<T> {
    render(element: T) : void;
}

export class Renderer implements RendererVistor {
    pointRenderer: PointRenderer;
    gridRenderer: GridRenderer;
    lineRenderer: LineRenderer;
    candleRenderer: CandleRenderer;

    constructor(canvas: Canvas) {
        this.pointRenderer = new PointRenderer(canvas);
        this.gridRenderer = new GridRenderer(canvas);
        this.lineRenderer = new LineRenderer(canvas);
        this.candleRenderer = new CandleRenderer(canvas);
    }

    drawCandle(candle: Candle): void {
        this.candleRenderer.render(candle);
    }

    draw(point: Point): void {
        this.pointRenderer.render(point);
    }

    drawGrid(grid: Grid): void {
        this.gridRenderer.render(grid);
    }

    drawLine(line: Line): void {
        this.lineRenderer.render(line);
    }
}