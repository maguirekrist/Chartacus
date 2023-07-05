import { IDrawable, RendererVistor } from "../renderer";
import { Color, IPositionable } from "./data";
import { Object2D } from "./object2D";


export class Point extends Object2D {
    color: Color;
    strokeColor: Color;


    constructor(x: number, y: number, color: Color) {
        super();
        this.position = { x, y };
        this.scale = 25;
        this.width = this.scale;
        this.height = this.scale;
        this.color = color;
        this.updateMatrix();
    }

    public getColorAsArray(): number[] {
        return [this.color.r, this.color.g, this.color.b, this.color.a ?? 1.0];
    }

    accept(visitor: RendererVistor): void {
        visitor.drawPoint(this);
    }
}