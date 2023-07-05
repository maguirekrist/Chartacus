import { IDrawable, RendererVistor } from "../renderer";
import { Coordinate } from "./data";



export class Line implements IDrawable {
    data: Coordinate[];

    constructor(data: Coordinate[]) {
        this.data = data;
    }

    accept(visitor: RendererVistor): void {
        visitor.drawLine(this);
    }
}