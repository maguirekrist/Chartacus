import { Line } from "../model/line";
import { IRender } from "../renderer";



export class LineRenderer implements IRender<Line> {
    gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    render(element: Line): void {
        throw new Error("Method not implemented.");
    } 
}