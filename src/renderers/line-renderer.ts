import { Line } from "../model/line";
import { IRender } from "../core/renderer";
import { Canvas } from "../core/canvas";



export class LineRenderer implements IRender<Line> {
    private _canvas: Canvas;

    constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    render(element: Line): void {
        throw new Error("Method not implemented.");
    } 
}